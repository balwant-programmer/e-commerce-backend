import slugify from "slugify";
import CreateprojectModel from "../models/createprojectSchem.js";
import uploadImageCloudinary from "../utils/Cloudinary.js";
import path from "node:path";
export const CreateProductController = async (req, res) => {
  try {
    const { name, description, price, categroyId, subcategoryname, emoji } =
      req.body;
    if (
      !name ||
      !description ||
      !price ||
      !categroyId ||
      !subcategoryname ||
      !emoji
    ) {
      return res
        .status(400)
        .json({ message: "All Fields are required!", success: false });
    }

    const findeDataTheName = await CreateprojectModel.findOne({ name });
    if (findeDataTheName) {
      return res
        .status(500)
        .json({ message: "name must be unique  !", success: false });
    }

    const files = req?.files;
    if (files.length === 0) {
      return res
        .status(404)
        .json({ message: "no select any file !", success: false });
    }
    if (files?.length === 2 || files?.length === 4 || files?.length === 3) {
      const AllData = await Promise.all(
        files.map(async (image) => {
          const filename = crypto.randomUUID() + path.join(image?.originalname);
          const CloduiniayUrl = await uploadImageCloudinary(
            image?.buffer,
            filename
          );
          return CloduiniayUrl;
        })
      );
      if (!AllData.length === 0) {
        return res
          .status(500)
          .json({ message: "Somthing is Wrong !", success: false });
      }

      const slug = slugify(name);

      if (AllData.length > 0) {
        const createdproduct = new CreateprojectModel({
          name,
          description,
          category: categroyId,
          slug,
          price,
          emoji,
          subcategoryname: subcategoryname,
          productLink: process?.env?.PRODUCT_LINK,
          image: AllData[0],
          subImage: AllData.slice(1),
        });
        await createdproduct.save();

        res
          .status(200)
          .json({ message: "product successFully uplaoded !", success: true });
      } else {
        return res.status(500).json({
          message: "somtihng wrong of cloudinray response !",
          success: false,
        });
      }
    } else {
      return res.status(404).json({
        message: "File Select 2 or more the 4 can only !",
        success: false,
      });
    }
  } catch (error) {
    console.log("errror while create product !", error);
  }
};
