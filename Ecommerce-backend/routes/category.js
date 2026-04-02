import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
} from "../controller/category.js";

const router = express.Router();

router.post("/category/new", isAuth, createCategory);
router.get("/category/all", getAllCategories);
router.delete("/category/:id", isAuth, deleteCategory);

export default router;
