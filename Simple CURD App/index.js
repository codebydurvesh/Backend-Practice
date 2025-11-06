const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const productRoute = require("./routes/product.route.js");

const app = express();

// middleware
app.use(express.json()); // To use json for testing APIs
app.use(express.urlencoded({ extended: false })); // To use Form URL Encoded for testing APIs

app.use("/api/products", productRoute); // routes

app.get("/", (req, res) => {
  res.send("Hello from node API!");
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Please add it to a .env file.");
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Connection Failed!", err && err.message ? err.message : "");
    }); // Connect to MongoDB
}

app.listen(3000, () => {
  console.log("\n Server is running on http://localhost:3000/");
}); // run server on port 3000
