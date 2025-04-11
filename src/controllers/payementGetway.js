import stripe from "stripe";
import { config } from "dotenv";

config();

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const payments = async (req, res) => {
  try {
    const { cartData } = req?.body?.orderData;

    let totalAmount = 0;
    let totalQuantity = 0;

    const cartItems = cartData?.map((item) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      totalQuantity += item.quantity;

      return {
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
      };
    });

    totalAmount = totalAmount * 100;
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: totalAmount,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      success: true,
      totalAmount,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({
      error: error.message,
    });
  }
};
