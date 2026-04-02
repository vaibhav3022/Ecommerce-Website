import { createTransport } from "nodemailer";
import { mailTemplate } from "./mailTemplate.js";

const sendWelcomeMail = async (user) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const title = "Welcome to V-Retail Masterpiece!";
  const content = `
    <p>Dear <strong>${user.name || user.email.split('@')[0]}</strong>,</p>
    <p>Your account has been officially activated on <strong>V-Retail</strong>. We are thrilled to have you as part of our exclusive circle of shoppers.</p>
    <p>Discover our latest curated collections from Hinjewadi, Pune and enjoy a premium shopping experience tailored just for you.</p>
    <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.Frontend_Url}" class="button">Visit Our Collections</a>
    </div>
  `;

  try {
    await transport.sendMail({
      from: `"V-Retail Official" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Registration Successful | V-Retail",
      html: mailTemplate({ title, content }),
    });
    console.log(`[MAIL] Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`[MAIL_ERROR] Could not send welcome email to ${user.email}:`, error);
  }
};

export default sendWelcomeMail;
