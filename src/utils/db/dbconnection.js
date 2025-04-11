import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "e-commerce-project",
    });
    console.log("db connection success !");
  } catch (error) {
    console.log("error DB connection !", error);
  }
};

export default connectDb;
