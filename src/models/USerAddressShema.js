import mongoose from "mongoose";
const addressShema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  houseno: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const useraddress = mongoose.model("Address", addressShema);
export default useraddress;
