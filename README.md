# 🛍️ V-Retail | Premium E-Commerce Masterpiece

<div align="center">
  <img src="https://img.shields.io/badge/Live-Demo-7b68ee?style=for-the-badge&logo=rocket" />
  <a href="https://ecommerce-website.dhotrev384.workers.dev/"><h3>✨ Explore the Live Storefront</h3></a>
</div>

**V-Retail** is a state-of-the-art e-commerce platform designed for high-end retail experiences. Built with the **MERN** stack, it features a luxury aesthetic, a robust professional communication system, and a secure multi-layered authentication bridge tailored for both customers and administrators.

---

## 🌟 Key Features

### 💎 Premium User Experience
- **Luxury Branding**: Fully responsive UI built with Tailwind CSS and Shadcn UI, featuring glassmorphism, modern typography (Outfit/Inter), and smooth micro-animations.
- **Dynamic Interaction**: Personalized greetings ("Hi, Vaibhav") and real-time cart updates for a tailored shopping journey.
- **Smart Search**: High-performance product discovery integrated across curated collections.

### 🛡️ Professional Authentication Bridge
- **Customer Security**: Zero-password login via secure 6-digit OTPs sent directly to the user's registered email.
- **Administrative Bypass**: Exclusive master password access for the site owner, bypassing OTP for instant management.
- **Role-Based Provisioning**: Automatic role escalation—logging in with the admin email automatically grants full dashboard access.

### 💳 Transactional Infrastructure
- **Stripe Power-Up**: Secure online payments with localized INR support and automatic session reconciliation.
- **Fallback COD**: Reliable Cash on Delivery workflow with dedicated "Place Order" logic.
- **Inventory Control**: Precise real-time stock synchronization and "Sold" tracking upon successful checkout.

### 📧 Enterprise-Grade Communications
- **Luxury Mail Templates**: Custom-designed, branded HTML correspondence for OTPs, Order Confirmations, and Registration Success.
- **Official Identity**: Centralized communication system via `retail.support.in@gmail.com`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Shadcn UI, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Storage** | Cloudinary (High-Performance Media Hosting) |
| **Payments** | Stripe API Integration |
| **Mailing** | Nodemailer (Gmail SMTP) with Custom HTML Templates |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Stripe API Keys
- Cloudinary Media Storage Account
- Gmail App Password (for SMTP)

### Quick Installation

1. **Clone the Identity**
   ```bash
   git clone https://github.com/vaibhav3022/Ecommerce-Website.git
   cd Ecommerce-Website
   ```

2. **Initialize Backend**
   ```bash
   cd Ecommerce-backend
   npm install
   # Create a .env file with your MONGO_URL, MAIL_PASS, STRIPE_SECRET_KEY, etc.
   npm start
   ```

3. **Launch Frontend**
   ```bash
   cd ../Ecommerce-frontend
   npm install
   # Set VITE_SERVER_URL in your .env
   npm run dev
   ```

---

## 📸 Interactive Preview

> [!IMPORTANT]
> For the best experience, please visit the [Official Live Deployment](https://ecommerce-website.dhotrev384.workers.dev/).

---

## 👨‍💻 Author
**Vaibhav Dhotre**  
*Full Stack Developer & UI Enthusiast*

[![LinkedIn](https://img.shields.io/badge/Connect-LinkedIn-0077b5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/vaibhav-dhotre-96b83a224/)
[![Instagram](https://img.shields.io/badge/Follow-Instagram-e4405f?style=flat-square&logo=instagram)](https://www.instagram.com/iam_vaibhavdhotre?igsh=MXMxN3kwdjBkcXdsMA==)

© 2026 V-Retail. Engineered for Excellence.
