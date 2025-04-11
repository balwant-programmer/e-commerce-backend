import CreateProject from "../models/createprojectSchem.js";

export const subcategoryproduct = async (req, res) => {
  try {
    const { subcategoryName } = req.params;
    if (!subcategoryName) {
      return res
        .status(404)
        .json({ message: "subcategory not found !", success: false });
    }

    const filtersubcategoryproduct = await CreateProject.find({
      subcategoryname: subcategoryName,
    });
    if (filtersubcategoryproduct.length === 0) {
      return res
        .status(404)
        .json({ message: "not Found sub Category product !", success: false });
    }

    return res.status(200).json({
      message: "success all subcategry product",
      success: true,
      subcategoryproduct: filtersubcategoryproduct,
    });
  } catch (error) {
    console.log(
      `error while getting the fetch subcategory product ${error.message}`
    );
    res.status(500).json({ message: "server Internal Error", success: false });
  }
};
