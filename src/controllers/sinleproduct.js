import { isValidObjectId } from "mongoose";
import CreateProject from "../models/createprojectSchem.js";
import { Review } from "../models/RatingAndReviewShema.js";

const singleproduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const product = await CreateProject.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const ratingAndReview = await Promise.all(
      product?.rating?.map((RatingId) => {
        const findTheRatingAndReview = Review?.findOne({ _id: RatingId });
        return findTheRatingAndReview;
      })
    );
    return res.status(200).json({
      success: true,
      product,
      ratingAndReview,
    });
  } catch (error) {
    console.log("Error fetching product:", error);
    return res.status(500).json({
      message: "Server error while fetching product",
      success: false,
    });
  }
};

export default singleproduct;
