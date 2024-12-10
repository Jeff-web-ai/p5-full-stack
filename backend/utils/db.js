import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL).then((data) => {
      console.log(
        colors.cyan.underline(`Database connected with ${data.connection.host}`)
      );
    });
  } catch (error) {
    console.log(error);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
