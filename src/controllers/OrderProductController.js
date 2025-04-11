import addtocartModel from "../models/addToCartShema.js";
import orderModel from "../models/userOrderShema.js";
export const ordercreate = async (req, res) => {
  try {
    const { orderData, cashOnDelevery } = req?.body;
    if (!orderData) {
      return res
        .status(404)
        .json({ message: "ordered Fieled !", succes: false });
    }

    let totalprice = 0;
    orderData?.forEach(({ price, quantity }) => {
      totalprice += price * quantity;
    });

    const card = new orderModel({
      orderData: orderData,
      amount: totalprice,
      cashOnDelevery: cashOnDelevery,
    });
    await card.save();
    const deletecartItem = await Promise.all(
      orderData?.map(async ({ productId, userId }) => {
        const deletedData = await addtocartModel.deleteOne({
          $and: [{ productId: productId }, { userId: userId }],
        });
        return deletedData;
      })
    );
    if (deletecartItem[0]?.deletedCount === 1) {
      return res
        .status(200)
        .json({ message: "ordered Suceess !", success: true });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error !", success: false });
  }
};

export const getOrder = async (req, res) => {
  try {
    let { _id: userId } = req.user;
    userId = userId.toString();

    const order = await orderModel
      .find({
        orderData: { $elemMatch: { userId: userId } },
      })
      .sort({ createdAt: -1 });

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found. Your order history is empty.",
      });
    }
    return res.status(200).json({
      message: "Your order Product ",
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error !", success: false });
  }
};

export const cancelOrderData = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    if (!orderId || !productId) {
      return res
        .status(404)
        .json({ message: "Invalid order or product!", success: false });
    }

    const deleteProduct = await orderModel.updateOne(
      { _id: orderId },
      { $pull: { orderData: { productId: productId } } }
    );

    const order = await orderModel.findOne({ _id: orderId });

    if (order && order.orderData.length === 0) {
      await orderModel.deleteOne({ _id: orderId });
      return res
        .status(200)
        .json({ message: "Cancel success. Order deleted.", success: true });
    }
    if (deleteProduct.modifiedCount === 1) {
      return res
        .status(200)
        .json({ message: "Product canceled successfully.", success: true });
    }

    return res
      .status(400)
      .json({ message: "Failed to cancel the product.", success: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};
