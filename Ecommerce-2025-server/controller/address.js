import { Address } from "../models/Address.js";
import TryCatch from "../utils/TryCatch.js";

export const addAddress = TryCatch(async (req, res) => {
  const {
    name,
    phone,
    pincode,
    locality,
    address,
    city,
    state,
    landmark,
    alternatePhone,
    addressType,
  } = req.body;

  if (!name || !phone || !pincode || !locality || !address || !city || !state) {
    return res.status(400).json({
      message: "All required fields must be filled",
    });
  }

  await Address.create({
    name,
    phone,
    pincode,
    locality,
    address,
    city,
    state,
    landmark,
    alternatePhone,
    addressType,
    user: req.user._id,
  });

  res.status(201).json({
    message: "Address created",
  });
});

export const getAllAddress = TryCatch(async (req, res) => {
  const allAdress = await Address.find({ user: req.user._id });

  res.json(allAdress);
});

export const getSingleAddress = TryCatch(async (req, res) => {
  const address = await Address.findById(req.params.id);

  res.json(address);
});

export const deleteAddress = TryCatch(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  await address.deleteOne();

  res.json({
    message: "address Deleted",
  });
});
