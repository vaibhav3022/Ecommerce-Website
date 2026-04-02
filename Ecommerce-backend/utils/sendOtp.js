import { createTransport } from "nodemailer";
import { mailTemplate } from "./mailTemplate.js";

const sendOtp = async ({ email, subject, otp }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const title = "Authentication Security Code";
  const content = `
    <p>We've received a request for a secure access code for your account at <strong>${email}</strong>.</p>
    <p>Please enter the following 6-digit verification code to proceed:</p>
    <div style="text-align: center; margin: 40px 0;">
        <div style="font-size: 42px; font-weight: 900; color: #7b68ee; letter-spacing: 5px; background: #f8f9fa; padding: 20px; border-radius: 16px; display: inline-block;">
            ${otp}
        </div>
    </div>
    <p style="font-size: 14px; color: #94a3b8;">This code is valid for a limited time. If you did not request this, please ignore this email.</p>
  `;

  await transport.sendMail({
    from: `"V-Retail Official" <${process.env.MAIL_USER}>`,
    to: email,
    subject,
    html: mailTemplate({ title, content }),
  });
};

export default sendOtp;
