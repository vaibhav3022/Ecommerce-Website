import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  updateProductImage,
  addReview,
  getReviews,
  deleteReview,
} from "../controller/product.js";
import uploadFiles from "../middlewares/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", isAuth, updateProduct);
router.post("/product/:id", isAuth, uploadFiles, updateProductImage);
router.post("/product/review/:id", isAuth, addReview);
router.get("/product/review/:id", getReviews);
router.delete("/product/review", isAuth, deleteReview);

export default router;
