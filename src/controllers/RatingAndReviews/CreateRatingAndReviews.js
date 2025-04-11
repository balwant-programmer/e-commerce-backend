import CreateProject from "../../models/createprojectSchem.js";
import { Review } from "../../models/RatingAndReviewShema.js";
const CreateRatingAndReviews = async (req, res) => {
  try {
    const user = req.user._id;
    const { productId } = req.params;
    const { rating, review } = req.body;
    if (!rating) {
      return res.status(400).json({ message: "please select rating" });
    }
    if (!review) {
      return res.status(400).json({ message: "Please fill review !" });
    }
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }
    if (!productId) {
      return res.status(500).json({
        message: "Something went wrong, try again later!",
        success: false,
      });
    }
    const existingReview = await Review.findOne({ userId: user, productId });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.review = review;

      await existingReview.save();
      return res.status(200).json({
        message: "Your review has been updated successfully.",
        success: true,
      });
    } else {
      const newReview = new Review({
        userId: user,
        rating,
        review,
        productId,
      });
      await CreateProject?.updateOne(
        { _id: productId },
        { $addToSet: { rating: newReview._id } }
      );
      await newReview.save();
      return res.status(200).json({
        message: "Thank you for your review!",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error while getting rating and review:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default CreateRatingAndReviews;
