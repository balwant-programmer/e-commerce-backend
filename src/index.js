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

//-----cors ..

app.use(
  cors({
    origin: [
      "http://192.168.1.18:5173",
      "http://localhost:5173",
      "http://192.168.1.18:5174",
      "http://192.168.43.86:5173",
    ],
    credentials: true,
  })
);

// ---------- routes ---------
app.use("/api/v1/product", createproductroutes);
app.use("/api/v1/category", categoryroutes);
app.use("/api/v1/user", userroutes);
app.use("/api/v1/", productRatingroutes);

const port = process.env.PORT || 3000;
app.listen(port, async (error) => {
  if (error) return;
  try {
    await connectDb();
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log("error while db connecion !");
  }
});
