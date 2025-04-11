import { isValidObjectId } from "mongoose";
import addtocartModel from "../models/addToCartShema.js";
import CreateProject from "../models/createprojectSchem.js";
export const AddToCartController = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req?.user?._id;
    if ((!productId || !quantity, !price)) {
      return res
        .status(404)
        .json({ message: "All flieds required !", success: false });
    }
    if (!isValidObjectId(userId)) {
      return res
        .status(404)
        .json({ message: "invalid OjectId", success: false });
    }

    if (!isValidObjectId(productId)) {
      return res
        .status(404)
        .json({ message: "invalid OjectId", success: false });
    }
    const productDetailsandUserId = await addtocartModel.findOne({
      $and: [{ userId: userId }, { productId: productId }],
    });
    if (productDetailsandUserId) {
      productDetailsandUserId.quantity += 1;
      productDetailsandUserId.price += Number(price);
      await productDetailsandUserId.save();
      return res
        .status(200)
        .json({ message: "quantity increase successs !", success: true });
    } else {
      const cartitem = new addtocartModel({
        productId,
        quantity,
        price,
        userId,
      });
      await cartitem.save();
      return res
        .status(200)
        .json({ message: "item add to cart !", success: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const decrementCart = async (req, res) => {
  try {
    const { productId, price } = req.body;
    let { _id: userId } = req.user;
    if (!productId || !price) {
      return res
        .status(404)
        .json({ message: "All flieds required !", success: false });
    }
    if (!isValidObjectId(userId.toString())) {
      return res
        .status(404)
        .json({ message: "invalid OjectId", success: false });
    }

    if (!isValidObjectId(productId)) {
      return res
        .status(404)
        .json({ message: "invalid OjectId", success: false });
    }
    userId = userId.toString();
    const productDetailsandUserId = await addtocartModel.findOne({
      $and: [{ userId }, { productId }],
    });

    if (productDetailsandUserId) {
      productDetailsandUserId.quantity -= 1;
      productDetailsandUserId.price -= Number(price);
      if (productDetailsandUserId.quantity === 0) {
        await addtocartModel.deleteOne({
          $and: [{ userId }, { productId }],
        });
        return res.status(200).json({
          message: "cart is Deleted !",
          success: true,
          productId: productDetailsandUserId?.productId,
        });
      }
      await productDetailsandUserId.save();
      return res.status(200).json({
        message: "quantity decrease successs !",
        success: true,
        quantity: productDetailsandUserId?.quantity,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const DeletedCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let { _id: userId } = req.user;
    if (!productId) {
      return res
        .status(404)
        .json({ message: "All flieds required !", success: false });
    }
    if (!isValidObjectId(userId.toString())) {
      return res
        .status(404)
        .json({ message: "invalid OjectId", success: false });
    }

    if (!isValidObjectId(productId)) {
      return res
        .status(404)
        .json({ message: "invalid OjectId", success: false });
    }
    userId = userId.toString();
    const deleted = await addtocartModel.deleteOne({
      $and: [{ userId }, { productId }],
    });
    if (deleted.deletedCount === 1) {
      return res.status(200).json({
        message: "Item successfully removed from cart",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchCartData = async (req, res) => {
  try {
    let userId = req?.user?._id;
    userId = userId.toString();
    if (!userId) {
      return res
        .tatus(404)
        .json({ message: "you are not loggedin !", success: false });
    }
    if (!isValidObjectId(userId)) {
      return res
        .status(404)
        .json({ message: "Somethings Is Wrong !", success: false });
    }
    userId = userId?.toString();

    const cart = await addtocartModel?.find({ userId });
    if (cart?.length === 0) {
      return res.status(404).json({ message: "Empty Cart", success: false });
    }
    const productData = await Promise.all(
      cart?.map(async ({ productId }) => {
        const product = await CreateProject.findOne({ _id: productId }).select({
          name: 1,
          price: 1,
          _id: 1,
          image: 1,
        });
        return product;
      })
    );
    const cartitem = [];
    productData?.forEach(({ _id, name, image, price }) => {
      cart?.forEach(({ userId, productId, quantity }) => {
        const productIdstr = _id.toString();
        if (productId === productIdstr) {
          cartitem.push({
            image,
            price,
            name,
            userId,
            quantity,
            productId,
            _id,
          });
        }
      });
    });
    let TotalQuantity = 0;
    cartitem.forEach(({ quantity }) => {
      TotalQuantity += quantity;
    });

    return res.status(200).json({
      message: "all cart item !",
      success: true,
      cartitem,
      TotalQuantity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
