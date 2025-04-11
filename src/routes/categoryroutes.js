import express from "express";
import {
  createCategoryName,
  createSubcategory,
  deletesubAllCategory,
  deletesubCategory,
} from "../controllers/CreateCategoryNameController.js";
import { getcategoryController } from "../controllers/getCageoryNameController.js";
const router = express.Router();

router.route("/createcategory").post(createCategoryName);
router.route("/allcategory").get(getcategoryController);
router.route("/createsubcategory/:mainCategoryId").post(createSubcategory);
router
  .route("/deletsubcategory/:mainCategoryId/:subcategoryIndex")
  .delete(deletesubCategory);
router.route("/deleteallcategory/:mainCategoryId").delete(deletesubAllCategory);

export default router;
