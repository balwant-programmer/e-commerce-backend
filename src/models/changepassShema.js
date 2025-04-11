import mongoose from "mongoose";

const userOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: () => Date.now() + 180000,
    index: { expires: 180 },
  },
});

const Otp = mongoose.model("UserOtp", userOtpSchema);

export default Otp;
