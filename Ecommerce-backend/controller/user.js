import { OTP } from "../models/Otp.js";
import { User } from "../models/User.js";
import TryCatch from "../utils/TryCatch.js";
import sendOtp from "../utils/sendOtp.js";
import sendWelcomeMail from "../utils/sendWelcomeMail.js";
import jwt from "jsonwebtoken";

/**
 * Handles user login using either Email or Phone number.
 * Generates a 6-digit OTP and sends it to the user's verified email.
 * [Admin Bypass]: If the email matches the Admin email, OTP sending is skipped.
 */
export const loginUser = TryCatch(async (req, res) => {
  const { email: targetEmail } = req.body;
  
  // --- ADMIN BYPASS LOGIC ---
  if (targetEmail === process.env.ADMIN_EMAIL) {
    return res.json({
      message: "Administrative access detected. Please enter your secure password.",
      email: targetEmail,
      isAdminBypass: true
    });
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
 * [Admin Bypass]: Validates static password for the admin account.
 */
export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  // --- ADMIN BYPASS LOGIC ---
  if (email === process.env.ADMIN_EMAIL) {
    if (otp !== process.env.ADMIN_PASS) {
      return res.status(400).json({ message: "Invalid administrative credentials" });
    }
  } else {
    const validOtpEntry = await OTP.findOne({ email, otp });
    if (!validOtpEntry) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }
    await validOtpEntry.deleteOne();
  }

  // Provision or fetch the user record
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name: email.split("@")[0], // Fallback name based on email prefix
      role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
    });
    
    // Send Welcome Email for new registrations
    await sendWelcomeMail(user);
  } else if (email === process.env.ADMIN_EMAIL && user.role !== "admin") {
    // Ensure existing admin user has the correct role
    user.role = "admin";
    await user.save();
  }

  // Sign the access token for the session
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
    expiresIn: "15d",
  });

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
