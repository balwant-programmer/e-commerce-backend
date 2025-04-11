import CreateProject from "../models/createprojectSchem.js";
import { User } from "../models/UserAutSchema.js";

export const userWishlist = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    let { productId } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const productIndex = user.wishlist.findIndex((pId) => pId === productId);

    if (productIndex !== -1) {
      user.wishlist.splice(productIndex, 1);
      await user.save();
      return res.status(200).json({ message: "unSave", success: true });
    } else {
      user.wishlist.addToSet(productId);
      await user.save();
      return res.status(200).json({ message: "Saved", success: true });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server Error !", success: false });
  }
};

export const userWishlistGet = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const wishlistData = await Promise.all(
      user.wishlist.map(async (pId) => {
        const findThewishlist = await CreateProject.find({ _id: pId });
        return findThewishlist;
      })
    );
    res
      .status(200)
      .json({ message: "Fethc success", success: true, wishlistData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server Error !", success: false });
  }
};
