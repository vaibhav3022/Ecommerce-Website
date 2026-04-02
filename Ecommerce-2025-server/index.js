import dns from "node:dns";
import express from "express";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cors from "cors";

// Internal modules
import connectDb from "./utils/db.js";

// Page/Feature Routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";
import categoryRoutes from "./routes/category.js";

// --- Configuration & Initialization ---
dotenv.config();

// Critical: Override default DNS to resolve MongoDB Atlas SRV records in some environments
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Cloudinary Asset Management Setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

// --- Global Middleware ---
app.use(express.json());

// CORS Policy: Restrict origins based on environment
app.use(
  cors({
    origin: [process.env.Frontend_Url, "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Basic Security: Remove standard headers that reveal server technology
app.disable("x-powered-by");

// --- System Endpoints ---
app.get("/health", (req, res) => {
  res.json({ 
    status: "V-Retail API Node is healthy",
    timestamp: new Date().toISOString() 
  });
});

// --- API Route Mounting ---
// Organized by feature set for clarity
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", categoryRoutes);

// --- Error Management ---
// Centralized error handler to catch all TryCatch exceptions and unhandled rejections
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // In production, we mask the stack trace for security
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// --- Server Bootstrap ---
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`[BOOT] V-Retail Server active on port ${port}`);
  
  // Connect to DB only after the server is successfully listening
  connectDb();
});
