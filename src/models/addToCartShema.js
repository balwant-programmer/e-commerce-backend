import mongoose from "mongoose";
const addtocartshema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  quantity: { type: Number, required: true },
  price: {
    type: Number,
    required: true,
  },
});

const addtocartModel = mongoose.model("addtocart", addtocartshema);
export default addtocartModel;
