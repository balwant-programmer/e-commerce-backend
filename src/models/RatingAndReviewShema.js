import mongoose from "mongoose";
const ratingAndReviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    productId: { type: String, required: true },
  },
  { timestamps: true }
);
const Review =
  mongoose.models.Review || mongoose.model("Review", ratingAndReviewSchema);

export { Review };
