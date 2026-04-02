import { OTP } from "../models/Otp.js";
import { User } from "../models/User.js";
import TryCatch from "../utils/TryCatch.js";
import sendOtp from "../utils/sendOtp.js";
import jwt from "jsonwebtoken";

/**
 * Handles user login using either Email or Phone number.
 * Generates a 6-digit OTP and sends it to the user's verified email.
 */
export const loginUser = TryCatch(async (req, res) => {
  const { email: loginCredential } = req.body;
  
  let targetEmail = loginCredential;
  const isPhoneFormat = /^[0-9]{10}$/.test(loginCredential);

  // If input is a phone number, resolve the associated account email
  if (isPhoneFormat) {
    const user = await User.findOne({ phone: Number(loginCredential) });
    if (!user) {
      return res.status(404).json({ message: "Account not found with this mobile number" });
    }
    targetEmail = user.email;
  }

  const otp = Math.floor(Math.random() * 900000) + 100000;
  
  // Clean up any existing OTPs for this email to prevent race conditions
  await OTP.findOneAndDelete({ email: targetEmail });

  // Discarding the 'subject' into a variable for cleaner function calls
  const mailSubject = "V-Retail | Your Authentication Code";
  await sendOtp({ email: targetEmail, subject: mailSubject, otp });
  await OTP.create({ email: targetEmail, otp });

  res.json({
    message: "A verification code has been sent to your email",
    email: targetEmail,
  });
});

/**
 * Verifies the OTP and returns a signed JWT access token.
 * Automatically provisions a new account if the user is first-time.
 */
export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const validOtpEntry = await OTP.findOne({ email, otp });
  if (!validOtpEntry) {
    return res.status(400).json({ message: "Invalid or expired verification code" });
  }

  // Provision or fetch the user record
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name: email.split("@")[0], // Fallback name based on email prefix
    });
  }

  // Sign the access token for the session
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
    expiresIn: "15d",
  });

  await validOtpEntry.deleteOne();

  res.json({
    message: "Authentication successful",
    token: accessToken,
    user,
  });
});

/**
 * Fetches the authenticated user's profile details.
 */
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

/**
 * Toggles a product in the user's personal wishlist.
 */
export const wishlistToggle = TryCatch(async (req, res) => {
  const { id: productId } = req.params;
  const user = await User.findById(req.user._id);

  if (user.wishlist.includes(productId)) {
    user.wishlist.pull(productId);
    await user.save();
    return res.json({ message: "Removed from your collection" });
  }

  user.wishlist.push(productId);
  await user.save();
  res.json({ message: "Added to your collection" });
});

/**
 * Retrieves all items currently in the user's wishlist.
 */
export const getWishlist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ wishlist: user.wishlist || [] });
});

/**
 * Updates basic profile identity fields.
 */
export const updateProfile = TryCatch(async (req, res) => {
  const { name, gender, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (gender) user.gender = gender;
  if (phone) user.phone = phone;

  await user.save();
  res.json({ message: "Identity updated successfully", user });
});

/**
 * [Admin] Retrieves a list of all registered users except the requester.
 */
export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } });
  res.json({ users });
});

/**
 * [Admin] Toggles administrative privileges for a specific user.
 */
export const updateRole = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Administrative privileges required" });
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Toggle role between 'user' and 'admin'
  targetUser.role = targetUser.role === "admin" ? "user" : "admin";
  await targetUser.save();

  res.json({ 
    message: `Account privileges updated to ${targetUser.role.toUpperCase()}` 
  });
});
