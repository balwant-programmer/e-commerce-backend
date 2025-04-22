import express from "express";
import dotenv from "dotenv";
import createproductroutes from "./routes/productsroutes.js";
import connectDb from "./utils/db/dbconnection.js";
import cors from "cors";
import categoryroutes from "./routes/categoryroutes.js";
import userroutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import productRatingroutes from "./routes/RatingAndReview.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://snapshop-shop.netlify.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use("/api/v1/product", createproductroutes);
app.use("/api/v1/category", categoryroutes);
app.use("/api/v1/user", userroutes);
app.use("/api/v1/", productRatingroutes);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  try {
    await connectDb();
    console.log(`✅ Server is running on port ${port}`);
  } catch (error) {
    console.log("❌ Error while DB connection", error);
  }
});
