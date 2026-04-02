import express from "express";
import {
  getAllUsers,
  getWishlist,
  loginUser,
  myProfile,
  updateProfile,
  updateRole,
  verifyUser,
  wishlistToggle,
} from "../controller/user.js";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyUser);
router.get("/user/me", isAuth, myProfile);
router.put("/user/profile", isAuth, updateProfile);
router.post("/user/wishlist/:id", isAuth, wishlistToggle);
router.get("/user/wishlist", isAuth, getWishlist);

// Admin Routes
router.get("/users", isAuth, isAdmin, getAllUsers);
router.put("/user/:id", isAuth, isAdmin, updateRole);

export default router;
