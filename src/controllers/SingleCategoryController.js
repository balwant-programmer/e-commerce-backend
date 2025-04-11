import CreateProject from "../models/createprojectSchem.js";
import mongoose from "mongoose";
export const singleCategoryProductFetch = async (req, res) => {
  try {
    const { categoryName, totalShow = 10, page } = req.params;
    if (!categoryName || !totalShow || !page) {
      return res.status(400).json({
        message: "Category name, totalShow or page number not provided!",
        success: false,
      });
    }

    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(totalShow) || 10;
    const skip = (pageNumber - 1) * limit;

    const categoryProducts = await CreateProject.find({
      category: categoryName,
    })
      .skip(skip)
      .limit(limit);
    if (categoryProducts.length === 0) {
      return res.status(404).json({
        message: "No products found in this category!",
        success: false,
      });
    }
    const randomIndex = Math.floor(Math.random() * categoryProducts.length);
    const randomProduct = categoryProducts[randomIndex];

    res.json({
      message: "Category products fetched successfully",
      success: true,
      categoryProducts,
      randomProduct,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ------- single product ...

export const relatedProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const cleanedProductId = productId.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanedProductId)) {
      return res.status(400).json({
        message: "Invalid product ID format!",
        success: false,
      });
    }

    const product = await CreateProject.findOne({ _id: cleanedProductId });

    if (!product) {
      return res.status(404).json({
        message: "Related product not found!",
        success: false,
      });
    }

    const relatedproducted = await CreateProject.find({
      subcategoryname: product.subcategoryname,
    });
    return res
      .status(200)
      .json({ message: "related product ", success: true, relatedproducted });
  } catch (error) {
    console.error("Error fetching related:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
