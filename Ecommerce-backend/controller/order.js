import Stripe from "stripe";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import TryCatch from "../utils/TryCatch.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";

// Load environment variables for Stripe integration
dotenv.config();

const stripe = new Stripe(process.env.Stripe_Secret_Key);

/**
 * Handles Cash on Delivery (COD) order placement.
 * Manages inventory deduction and triggers confirmation emails.
 */
export const newOrderCod = TryCatch(async (req, res) => {
  const { method, phone, address } = req.body;

  // Resolve cart items for the authenticated user
  const userCart = await Cart.find({ user: req.user._id }).populate({
    path: "product",
    select: "title price",
  });

  if (!userCart.length) {
    return res.status(400).json({ message: "Unable to process order: Cart is empty" });
  }

  let orderTotal = 0;

  // Map cart items to order line items and calculate total
  const orderItems = userCart.map((item) => {
    const itemTotal = item.product.price * item.quauntity;
    orderTotal += itemTotal;

    return {
      product: item.product._id,
      name: item.product.title,
      price: item.product.price,
      quantity: item.quauntity,
    };
  });

  const order = await Order.create({
    items: orderItems,
    method,
    user: req.user._id,
    phone,
    address,
    subTotal: orderTotal,
  });

  // Critical: Synchronize inventory stock for each product in the order
  for (let item of order.items) {
    const targetProduct = await Product.findById(item.product);

    if (targetProduct) {
      targetProduct.stock -= item.quantity;
      targetProduct.sold += item.quantity;
      await targetProduct.save();
    }
  }

  // Clear user's cart post-purchase
  await Cart.deleteMany({ user: req.user._id });

  // Dispatch confirmation email
  await sendOrderConfirmation({
    email: req.user.email,
    subject: "V-Retail | Order Confirmation",
    orderId: order._id,
    products: orderItems,
    totalAmount: orderTotal,
  });

  res.status(201).json({
    message: "Order placed successfully. Thank you for shopping!",
    order,
  });
});

/**
 * Retrieves the order history for the authenticated user (Sorted by newest first).
 */
export const getAllOrders = TryCatch(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

/**
 * [Admin] Retrieves all system orders with user data resolved.
 */
export const getAllOrdersAdmin = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const allOrders = await Order.find().populate("user").sort({ createdAt: -1 });
  res.json(allOrders);
});

/**
 * Fetches specific details of an order including product metadata.
 */
export const getMyOrder = TryCatch(async (req, res) => {
  const orderDetails = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("user");

  if (!orderDetails) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(orderDetails);
});

/**
 * [Admin] Updates the fulfillment status of an order.
 */
export const updateStatus = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Administrative action only" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Target order mismatch" });
  }

  order.status = req.body.status;
  await order.save();

  res.json({
    message: `Order status updated to ${order.status.toUpperCase()}`,
    order,
  });
});

/**
 * [Admin] Compiles dashboard analytics including revenue, inventory counts, and order distribution.
 */
export const getStats = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized dashboard access" });
  }

  // Aggregate metrics concurrently for efficiency
  const [codCount, onlineCount, userCount, productCount, orderCount, allOrders, topProducts] = await Promise.all([
    Order.countDocuments({ method: "cod" }),
    Order.countDocuments({ method: "online" }),
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find(),
    Product.find().sort({ sold: -1 }).limit(10) // Top selling 10 products
  ]);

  const aggregateRevenue = allOrders.reduce((sum, order) => sum + (order.subTotal || 0), 0);

  const salesPerformanceData = topProducts.map((prod) => ({
    name: prod.title,
    sold: prod.sold,
  }));

  const recentTransactions = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email");

  res.json({
    cod: codCount,
    online: onlineCount,
    totalUsers: userCount,
    totalProducts: productCount,
    totalOrders: orderCount,
    totalRevenue: aggregateRevenue,
    recentOrders: recentTransactions,
    data: salesPerformanceData,
  });
});

/**
 * Generates a Stripe Checkout session for online payments.
 */
export const newOrderOnline = TryCatch(async (req, res) => {
  const { method, phone, address } = req.body;

  const currentCart = await Cart.find({ user: req.user._id }).populate("product");

  if (!currentCart.length) {
    return res.status(400).json({ message: "Cart validation failed: Empty cart" });
  }

  const sessionTotal = currentCart.reduce(
    (total, item) => total + item.product.price * item.quauntity,
    0
  );

  const stripeLineItems = currentCart.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.product.title,
        images: item.product.images?.[0]?.url ? [item.product.images[0].url] : [],
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quauntity,
  }));

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: stripeLineItems,
    mode: "payment",
    success_url: `${process.env.Frontend_Url}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.Frontend_Url}/cart`,
    metadata: {
      userId: req.user._id.toString(),
      method,
      phone,
      address,
      subTotal: sessionTotal,
    },
  });

  res.json({ url: checkoutSession.url });
});

/**
 * Reconciles the Stripe payment session with the database record.
 * Finalizes the order and triggers fulfillment logic.
 */
export const verifyPayment = TryCatch(async (req, res) => {
  const { sessionId } = req.body;

  // Resolve session from Stripe for integrity check
  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
  if (!stripeSession || stripeSession.payment_status !== 'paid') {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const { userId, method, phone, address, subTotal } = stripeSession.metadata;

  console.log(`[VERIFY_PAYMENT] Session ${sessionId} retrieved for User ${userId}`);

  // Check if order already exist to prevent duplicate processing
  const orderExists = await Order.findOne({ paymentInfo: sessionId });
  if (orderExists) {
    console.log(`[VERIFY_PAYMENT] Order already fulfilled for session ${sessionId}`);
    return res.status(200).json({ success: true, message: "Order already fulfilled", order: orderExists });
  }

  const activeCart = await Cart.find({ user: userId }).populate("product");
  if (!activeCart.length) {
    console.error(`[VERIFY_PAYMENT] Cart empty for User ${userId}. Verification aborted.`);
    return res.status(400).json({ message: "Invalid order state: Cart cleared or empty" });
  }

  const orderLineItems = activeCart.map((item) => ({
    product: item.product._id,
    quantity: item.quauntity,
    price: item.product.price,
    name: item.product.title
  }));

  const order = await Order.create({
    items: orderLineItems,
    method,
    user: userId,
    phone,
    address,
    subTotal: Number(subTotal),
    paidAt: new Date(),
    paymentInfo: sessionId,
    status: "Placed"
  });

  console.log(`[VERIFY_PAYMENT] Order ${order._id} created successfully.`);

  // Inventory Synchronization
  for (let item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity }
    });
  }

  // Final Cleanup
  await Cart.deleteMany({ user: userId });

  // Use a targeted email if req.user is missing (e.g. from a webhook/direct hit)
  const targetEmail = req.user?.email || (await User.findById(userId))?.email;

  if (targetEmail) {
    await sendOrderConfirmation({
      email: targetEmail,
      subject: "V-Retail | Payment Successful",
      orderId: order._id,
      products: orderLineItems,
      totalAmount: subTotal,
    });
  }

  res.status(201).json({
    success: true,
    message: "Order finalized and payment confirmed",
    order,
  });
});
