import useraddress from "../models/USerAddressShema.js";
import { User } from "../models/UserAutSchema.js";
export const addressController = async (req, res) => {
  try {
    const { address, phone, zipCode, houseno } = req.body;
    let { _id: userId } = req.user;
    userId = userId.toString();

    if (!address || !phone || !zipCode || !houseno) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const existingAddress = await useraddress.findOne({ userId: userId });
    if (existingAddress) {
      existingAddress.address = address;
      existingAddress.phone = phone;
      existingAddress.zipCode = zipCode;
      existingAddress.houseno = houseno;
      await existingAddress.save();
      return res
        .status(200)
        .json({ message: "Address updated successfully", success: true });
    } else {
      const newAddress = new useraddress({
        userId,
        address,
        phone,
        zipCode,
        houseno,
      });

      await newAddress.save();
      const findeUser = await User.findOne({ _id: userId });
      if (!findeUser) {
        return res
          .status(404)
          .json({ message: "Something's wrong!", success: false });
      }
      const addressId = newAddress._id.toString();
      if (findeUser) {
        findeUser.addressId = addressId;
        await findeUser.save();
        return res
          .status(201)
          .json({ message: "Address saved successfully", success: true });
      }
    }
  } catch (error) {
    console.error("Error processing address:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
