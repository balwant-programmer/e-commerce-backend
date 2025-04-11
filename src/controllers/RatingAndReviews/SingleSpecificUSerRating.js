import { Review } from "../../models/RatingAndReviewShema.js";
const ratingOfSpecificUSer = async (req, res) => {
  try {
    const { productId } = req.params;
    const { _id: userId } = req.user;

    if (!productId || !userId) {
      return res
        .status(404)
        .json({ message: "SomeThings Went Wrong !", success: false });
    }

    const userRatingAndReview = await Review.findOne({
      userId: userId,
      productId: productId,
    });

    if (!userRatingAndReview) {
      return res.status(404).json({
        message: "No rating or review found for this product.",
        success: false,
      });
    }

    const { rating, review } = userRatingAndReview.toObject();
    return res.status(200).json({
      message: "Successfully fetched user's rating and review.",
      success: true,
      data: {
        productId,
        rating,
        review,
      },
    });
  } catch (error) {
    console.error("Error while getting rating and review:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export default ratingOfSpecificUSer;
