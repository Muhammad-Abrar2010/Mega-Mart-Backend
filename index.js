const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./src/Routes/productRoutes");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.1wqdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/api", productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Mega Mart Server Running on port ${port}`);
});
