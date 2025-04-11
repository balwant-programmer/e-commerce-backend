import useraddress from "../../models/USerAddressShema.js";

export const userAuthCheck = async (req, res) => {
  try {
    let { _id: userId } = req.user;
    userId = userId.toString();
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
     
    const userAddress = await useraddress.findOne({ userId });
    const { password: _, ...userData } = req.user.toObject();
    return res.status(200).json({
      message: "User is authenticated",
      user: userData,
      userAddress,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};
