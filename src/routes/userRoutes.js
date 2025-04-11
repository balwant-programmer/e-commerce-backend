import express from "express";
import userRegister from "../controllers/UserAuth/UserregisterController.js";
import userlogin, {
  logoutUser,
  sendOtp,
  userLogo,
  userProfileUpdate,
  veryfyOtp,
} from "../controllers/UserAuth/userLoginController.js";
import { userAuthCheck } from "../controllers/UserAuth/UserchechAuth.js";
import { verifyToken } from "../middlewares/CheckUserLoginAuth.js";
import { uplaod } from "../middlewares/Multer.js";
import { addressController } from "../controllers/addressController.js";
import {
  userWishlist,
  userWishlistGet,
} from "../controllers/userWhislistController.js";
const router = express.Router();
router.route("/register").post(userRegister);
router.route("/login").post(userlogin);
router.route("/checkauth").get(verifyToken, userAuthCheck);
router.route("/logout").post(logoutUser);
router
  .route("/userlogo")
  .post(verifyToken, uplaod.single("userlogo"), userLogo);

// -----userAddress ....
router.route("/address").post(verifyToken, addressController);
router.route("/userprofileupdate").post(verifyToken, userProfileUpdate);
router.route("/otp").post(sendOtp);
router.route("/varifyotp").post(veryfyOtp);
router.route("/wishlist/:productId").post(verifyToken, userWishlist);
router.route("/wishlistget").get(verifyToken, userWishlistGet);

export default router;
