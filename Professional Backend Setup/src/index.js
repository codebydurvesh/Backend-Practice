// require("dotenv").config({path: './env'})

import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

const app = express();

connectDB();

/*

(async () => {
  try {
    mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();

*/

app.get("/", (req, res) => {
  try {
    const Product = {
      name: "Cheese Cake",
      price: 10.99,
      quantity: 15,
    };
    res.status(200).json(Product);
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running...");
});
