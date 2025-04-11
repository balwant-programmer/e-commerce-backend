import mongoose from "mongoose";
const productCategorySchema = new mongoose.Schema(
  {
    mainCategoryName: {
      type: String,
      required: true,
    },
    subCategoryName: {
      type: [String],
    },
    productCategory: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const ProductCategoryModel = mongoose.model(
  "ProductCategory",
  productCategorySchema
);
