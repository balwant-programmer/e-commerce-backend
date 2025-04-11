import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderData: {
      type: Array,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    cashOnDelevery: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
