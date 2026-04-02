import { Product } from "../models/Product.js";
import TryCatch from "../utils/TryCatch.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import cloudinary from "cloudinary";
import { Review } from "../models/Review.js";

/**
 * Creates a new product with multiple image uploads to Cloudinary.
 * Enforces admin-only access and handles buffer-to-cloud mapping.
 */
export const createProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin privileges required for this action" });
  }

  const { title, about, category, price, stock } = req.body;
  const productImages = req.files;

  if (!productImages || productImages.length === 0) {
    return res.status(400).json({ message: "At least one product image is required" });
  }

  // Upload all provided images concurrently to optimize performance
  const uploadPromises = productImages.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const uploadResult = await cloudinary.v2.uploader.upload(fileBuffer.content);

    return {
      id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  });

  const processedImages = await Promise.all(uploadPromises);

  const product = await Product.create({
    title,
    about,
    category,
    price,
    stock,
    images: processedImages,
  });

  res.status(201).json({
    message: "Product catalog updated successfully",
    product,
  });
});

/**
 * Retrieves all products with advanced filtering, search, and pagination.
 * Supports price sorting and dynamic category discovery.
 */
export const getAllProducts = TryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  const mongoQuery = {};

  // Case-insensitive search on product titles
  if (search) {
    mongoQuery.title = { $regex: search, $options: "i" };
  }

  if (category) {
    mongoQuery.category = category;
  }

  // Pagination Logic
  const PAGE_LIMIT = 8;
  const pageNumber = Number(page) || 1;
  const skipCount = (pageNumber - 1) * PAGE_LIMIT;

  // Sorting configurations
  const sortMap = {
    lowToHigh: { price: 1 },
    highToLow: { price: -1 },
    default: { createdAt: -1 }
  };

  const sortOption = sortMap[sortByPrice] || sortMap.default;

  // Execute queries
  const [products, categories, newArrivals, totalInventory] = await Promise.all([
    Product.find(mongoQuery).sort(sortOption).limit(PAGE_LIMIT).skip(skipCount),
    Product.distinct("category"),
    Product.find(mongoQuery).sort("-createdAt").limit(4),
    Product.countDocuments(mongoQuery)
  ]);

  const totalPages = Math.ceil(totalInventory / PAGE_LIMIT);

  res.json({ 
    products, 
    categories, 
    totalPages, 
    newProduct: newArrivals 
  });
});

/**
 * Fetches single product details and resolves related items in the same collection.
 */
export const getSingleProduct = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found in our catalog" });
  }

  // Find related products by category, excluding the current one
  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  res.json({ product, relatedProduct });
});

/**
 * Updates basic product metadata (title, category, pricing, stock).
 */
export const updateProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access denied" });
  }

  const { title, about, category, price, stock } = req.body;
  const updatePayload = {};

  if (title) updatePayload.title = title;
  if (about) updatePayload.about = about;
  if (stock) updatePayload.stock = stock;
  if (price) updatePayload.price = price;
  if (category) updatePayload.category = category;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updatePayload,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({ message: "Target product does not exist" });
  }

  res.json({
    message: "Product updated successfully",
    updatedProduct,
  });
});

/**
 * Bulk replaces product images. Deletes old assets from Cloudinary.
 */
export const updateProductImage = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin authorization required" });
  }

  const { id } = req.params;
  const newFiles = req.files;

  if (!newFiles || newFiles.length === 0) {
    return res.status(400).json({ message: "New images are required for a refresh" });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product mismatch" });
  }

  // Cleanup existing images from CDN to avoid storage bloating
  const cleanupTasks = (product.images || []).map(async (img) => {
    if (img.id) await cloudinary.v2.uploader.destroy(img.id);
  });
  await Promise.all(cleanupTasks);

  // Upload new assets
  const uploadTasks = newFiles.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);
    return { id: result.public_id, url: result.secure_url };
  });

  product.images = await Promise.all(uploadTasks);
  await product.save();

  res.status(200).json({
    message: "Visual assets updated successfully",
    product,
  });
});

/**
 * Adds or updates a user review for a product. Re-calculates global rating.
 */
export const addReview = TryCatch(async (req, res) => {
  const { rating, comment } = req.body;
  const { id: productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product vanished" });
  }

  const userReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (userReview) {
    userReview.rating = rating;
    userReview.comment = comment;
    await userReview.save();
  } else {
    await Review.create({
      user: req.user._id,
      name: req.user.name,
      product: productId,
      rating,
      comment,
    });
    product.numOfReviews += 1;
  }

  // Sync the aggregate product rating
  const allReviews = await Review.find({ product: productId });
  const totalScore = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
  
  product.ratings = totalScore / (allReviews.length || 1);
  await product.save();

  res.status(200).json({ message: "Your feedback has been published" });
});

/**
 * Resolves all published reviews for a specific item.
 */
export const getReviews = TryCatch(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).populate("user", "name");
  res.json({ reviews });
});

/**
 * Deletes a review record and triggers a product rating recalculation.
 */
export const deleteReview = TryCatch(async (req, res) => {
  const targetReview = await Review.findById(req.query.id);
  if (!targetReview) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Authorization check
  const isAuthorized = targetReview.user.toString() === req.user._id.toString() || req.user.role === "admin";
  if (!isAuthorized) {
    return res.status(403).json({ message: "Unauthorized action" });
  }

  await targetReview.deleteOne();

  const product = await Product.findById(req.query.productId);
  const updatedReviews = await Review.find({ product: req.query.productId });

  const totalScore = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
  
  product.ratings = updatedReviews.length === 0 ? 0 : totalScore / updatedReviews.length;
  product.numOfReviews = updatedReviews.length;

  await product.save();
  res.status(200).json({ message: "Review successfully retracted" });
});
