import { createTransport } from "nodemailer";
import { mailTemplate } from "./mailTemplate.js";

const sendOrderConfirmation = async ({
  email,
  subject,
  orderId,
  products,
  totalAmount,
}) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const productsHtml = products
    .map(
      (product) => `
            <div style="padding: 15px; background: #f8f9fa; border-radius: 12px; margin-bottom: 15px; border: 1px solid #f0f0f0;">
                <div style="font-weight: 700; color: #06061a;">${product.name}</div>
                <div style="font-size: 13px; color: #64748b;">Quantity: ${product.quantity} | Unit Price: ₹${product.price}</div>
            </div>
        `
    )
    .join("");

  const title = "Order Confirmed | V-Retail";
  const content = `
    <p>Dear <strong>${email}</strong>,</p>
    <p>Your order has been successfully placed and is now being prepared for shipping.</p>
    
    <div style="margin: 30px 0;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 5px;">Order ID</div>
        <div style="font-weight: 700; color: #06061a;">#${orderId}</div>
    </div>

    ${productsHtml}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 700; color: #64748b;">Total Amount</div>
        <div style="font-size: 24px; font-weight: 900; color: #7b68ee;">₹${totalAmount}</div>
    </div>
  `;

  await transport.sendMail({
    from: `"V-Retail Official" <${process.env.MAIL_USER}>`,
    to: email,
    subject,
    html: mailTemplate({ title, content }),
  });
};

export default sendOrderConfirmation;
