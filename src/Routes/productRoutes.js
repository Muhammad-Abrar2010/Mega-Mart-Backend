const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');
router.get("/products", async (req, res) => {
  console.log('Query parameters:', req.query); // Log query parameters

  const { page = 1, limit = 10, search = "", category, minPrice, maxPrice, brand, sort } = req.query;
  const filter = {};

  if (search) {
    filter.productName = { $regex: search, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }
  if (brand) {
    filter.brand = brand;
  }
  if (minPrice && maxPrice) {
    filter.price = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice) {
    filter.price = { $gte: minPrice };
  } else if (maxPrice) {
    filter.price = { $lte: maxPrice };
  }

  let sortCriteria = {};
  if (sort === "price_asc") {
    sortCriteria.price = 1;
  } else if (sort === "price_desc") {
    sortCriteria.price = -1;
  } else if (sort === "createdAt_desc") {
    sortCriteria.createdAt = -1;
  } else if (sort === "brand_asc") {
    sortCriteria.brand = 1;
  } else if (sort === "brand_desc") {
    sortCriteria.brand = -1;
  }
  try {
    const products = await Product.find(filter)
      .sort(sortCriteria)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
