import { ProductCategoryModel } from "../models/createcategorySchema.js";
import slugify from "slugify";

export const createCategoryName = async (req, res) => {
  try {
    let { mainCategoryName } = req.body;

    if (!mainCategoryName) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const existingCategory = await ProductCategoryModel.findOne({
      mainCategoryName: mainCategoryName,
    });

    if (existingCategory) {
      return res
        .status(409)
        .json({ message: "Duplicate category not allowed!", success: false });
    }
    mainCategoryName = slugify(mainCategoryName);
    const newCategory = new ProductCategoryModel({
      mainCategoryName,
    });
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully!",
      success: true,
      category: newCategory,
    });
  } catch (error) {
    console.log("Error creating category: ", error);
    res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

export const createSubcategory = async (req, res) => {
  try {
    let { subCategoryName } = req?.body;
    const { mainCategoryId } = req.params;
    if (!subCategoryName) {
      return res
        .status(404)
        .json({ message: "Fill subCategory name !", success: false });
    }
    const subCategryNameFind = await ProductCategoryModel.findOne({
      subCategoryName,
    });
    if (subCategryNameFind) {
      return res
        .status(400)
        .json({ message: "Duplicate name not Allowed !", success: false });
    }
    const findMainCategory = await ProductCategoryModel.findOne({
      _id: mainCategoryId,
    });
    if (!findMainCategory) {
      return res
        .status(404)
        .json({ message: "MainCategory not Found !", success: false });
    }
    subCategoryName = slugify(subCategoryName);
    findMainCategory.subCategoryName.push(subCategoryName);
    await findMainCategory.save();
    res.status(200).json({
      message: "SuccessFully create sub-CategoryName",
      success: true,
    });
  } catch (error) {
    console.log(`error while getting message create subCategory name ${error}`);
    res.status(500).json({
      message: "Server Internal Error  try again Later 1 ",
      success: false,
    });
  }
};
export const deletesubCategory = async (req, res) => {
  try {
    const { mainCategoryId, subcategoryIndex } = req.params;
    if (!mainCategoryId) {
      return res
        .status(404)
        .json({ message: "Smthing is Wrong deleted!", success: false });
    }

    const findMainCategory = await ProductCategoryModel.findOne({
      _id: mainCategoryId,
    });
    if (!findMainCategory) {
      return res
        .status(404)
        .json({ message: "MainCategory not Found !", success: false });
    }

    const data = findMainCategory?.subCategoryName?.splice(subcategoryIndex, 1);
    await findMainCategory.save();
    if (data.length === 1) {
      res.status(200).json({
        message: "deleted Success create sub-CategoryName",
        success: true,
        deletedData: data[0],
      });
    } else {
      return res
        .status(500)
        .json({ message: "somethings went Wrong !", success: false });
    }
  } catch (error) {
    console.log(`error while getting message create subCategory name ${error}`);
    res.status(500).json({
      message: "Server Internal Error  try again Later 1 ",
      success: false,
    });
  }
};
export const deletesubAllCategory = async (req, res) => {
  try {
    const { mainCategoryId } = req.params;
    if (!mainCategoryId) {
      return res
        .status(404)
        .json({ message: "Something is Wrong deleted!", success: false });
    }

    const deleletedData = await ProductCategoryModel.deleteOne({
      _id: mainCategoryId,
    });

    if (deleletedData?.deletedCount === 1) {
      return res
        .status(200)
        .json({ message: "Deleted Data Success !", success: true });
    }
  } catch (error) {
    console.log(
      `error while getting message create AllDeletedsubCategory name ${error}`
    );
    res.status(500).json({
      message: "Server Internal Error  try again Later 1 ",
      success: false,
    });
  }
};
