import { ProductCategoryModel } from "../models/createcategorySchema.js";
export const getcategoryController = async (_, res) => {
  try {
    const findeCategory = await ProductCategoryModel.find({});
    if (findeCategory.length === 0) {
      res.status(404).json({ message: "not any categry", success: false });
      return;
    }
    return res
      .status(200)
      .json({
        message: "all caetgory List fetch success",
        success: true,
        allcategory: findeCategory,
      });
  } catch (error) {
    console.log(`error while getting messaage get category name${error}`);
    res.status(500).json({
      massage: "error while getting messaage get category name$",
      success: false,
    });
  }
};
