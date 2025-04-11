import CreateProject from "../../models/createprojectSchem.js";
import { Review } from "../../models/ratingAndReviewShema.js";
import { User } from "../../models/UserAutSchema.js";

const getallRatingAndReview = async (req, res) => {
  try {
    const { productId } = req?.params;
    if (!productId) {
      return res
        .status(500)
        .json({ message: "SomeThings is Wrong !", success: false });
    }

    const findTheProductRatingAndReview = await Review.find({ productId });
    if (!findTheProductRatingAndReview) {
      res
        .status(404)
        .json({ message: "no Review Find the product !", success: false });
    }

    const user = await Promise.all(
      findTheProductRatingAndReview?.map(async ({ userId }) => {
        const findeTheAlluserOfTheRatingAndeview = await User.find({
          _id: userId,
        }).select("-password");
        return findeTheAlluserOfTheRatingAndeview;
      })
    );
    const product = await CreateProject?.findOne({ _id: productId });

    const totalReviewAndRating = await Review.find({
      productId,
    })?.countDocuments();
    return res.status(200).json({
      message: "Success fully Fetch Rating and Review",
      user,
      product,
      RatingAndReview: findTheProductRatingAndReview,
      totalReviewAndRating,

      success: true,
    });
  } catch (error) {
    console.log("error while getting the getall rating And review !", error);
    return res
      ?.status(500)
      ?.json({ message: "Server Internal Error !", success: false });
  }
};

export default getallRatingAndReview;
