import mongoose from "mongoose";

const createProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: [String],
    },
    subcategoryname: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    subImage: {
      type: [String],
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    wishlist: {
      type: [String],
    },
    productLink: {
      type: String,
    },
    emoji: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CreateProject = mongoose.model("CreateProject", createProjectSchema);

export default CreateProject;
