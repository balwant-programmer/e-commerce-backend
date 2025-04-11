import express from "express";
import { uplaod } from "../middlewares/Multer.js";
import { CreateProductController } from "../controllers/CreatePorjectController.js";
import { allproductfetch } from "../controllers/AllproductFtech.js";
import {
  relatedProduct,
  singleCategoryProductFetch,
} from "../controllers/SingleCategoryController.js";
import { subcategoryproduct } from "../controllers/SubcategoryProductFetch.js";
import singleproduct from "../controllers/sinleproduct.js";
import {
  decrementCart,
  AddToCartController,
  DeletedCart,
  fetchCartData,
} from "../controllers/AddToCartController.js";
import { verifyToken } from "../middlewares/CheckUserLoginAuth.js";
import { payments } from "../controllers/payementGetway.js";
import {
  cancelOrderData,
  getOrder,
  ordercreate,
} from "../controllers/OrderProductController.js";

const router = express.Router();

router
  .route("/createproject")
  .post(uplaod.array("images", 4), CreateProductController);

router.route("/allproduct").get(allproductfetch);
router
  .route("/singleproduct/:categoryName/:page")
  .get(singleCategoryProductFetch);

router.route("/subcategoryproduct/:subcategoryName").get(subcategoryproduct);
router.route("/singleproduct/:productId").get(singleproduct);
router.route("/addtocart").post(verifyToken, AddToCartController);
router.route("/cartdescrement").post(verifyToken, decrementCart);
router.route("/deletedcart").post(verifyToken, DeletedCart);
router.route("/getcart").get(verifyToken, fetchCartData);
router.route("/pay").post(verifyToken, payments);
router.route("/order").post(verifyToken, ordercreate);
router.route("/getorder").get(verifyToken, getOrder);
router
  .route("/cancelorder/:orderId/:productId")
  .delete(verifyToken, cancelOrderData);

// related product .. .

router.route("/relatedproduct/:productId").get(relatedProduct);

export default router;
