import { Category } from "../models/Category.js";
import TryCatch from "../utils/TryCatch.js";

export const createCategory = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { name } = req.body;

  const category = await Category.create({ name });

  res.status(201).json({
    message: "Category Created",
    category,
  });
});

export const getAllCategories = TryCatch(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.json({ categories });
});

export const deleteCategory = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const category = await Category.findById(req.params.id);

  if (!category)
    return res.status(404).json({
      message: "Category not found",
    });

  await category.deleteOne();

  res.json({
    message: "Category Deleted",
  });
});
