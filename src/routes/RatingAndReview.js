import express from "express";
import CreateRatingAndReviews from "../controllers/RatingAndReviews/CreateRatingAndReviews.js";
import { verifyToken } from "../middlewares/CheckUserLoginAuth.js";
import ratingOfSpecificUSer from "../controllers/RatingAndReviews/SingleSpecificUSerRating.js";
import getallRatingAndReview from "../controllers/RatingAndReviews/geAllratingAndReveiwController.js";
const router = express.Router();

router.route("/rating/:productId").post(verifyToken, CreateRatingAndReviews);
router.route("/ratinguser/:productId").get(verifyToken, ratingOfSpecificUSer);
router.route("/getratingall/:productId").get(getallRatingAndReview);

export default router;
