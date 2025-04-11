import CreateprojectModel from "../models/createprojectSchem.js";
export const allproductfetch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);
    const skip = (page - 1) * limit;
    let { selectedCategories = "", emoji, query } = req.query;
    let filter = {};
    let subcategoryname = selectedCategories
      ? selectedCategories.split(",")
      : [];
    if (subcategoryname.length > 0) {
      filter.subcategoryname = { $in: subcategoryname };
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (query && typeof query === "string" && query.length > 0) {
      const trimmedQuery = query.trim();

      filter.$or = [
        { name: { $regex: trimmedQuery, $options: "i" } },
        { description: { $regex: trimmedQuery, $options: "i" } },
        { subcategoryname: { $regex: trimmedQuery, $options: "i" } },
      ];

      if (!isNaN(query)) {
        filter.$or.push({
          price: { $eq: Number(query) },
        });
      }
    }

    const emojiData = emoji ? emoji : "";
    if (emojiData) {
      filter.emoji = emoji;
    }

    let allData = await CreateprojectModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (allData.length === 0) {
      allData = await CreateprojectModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    }
    return res.status(200).json({
      data: allData,
      currentPage: page,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
