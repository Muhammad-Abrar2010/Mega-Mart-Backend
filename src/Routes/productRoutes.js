
const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');

// Get products with pagination, searching, filtering, and sorting
router.get("/products", async (req, res) => {
    const { page = 1, limit = 10, search = "", category, minPrice, maxPrice, sort } = req.query;
  
    const filter = {};
  
    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }
  
    console.log("Filter criteria:", filter);
  
    try {
      const products = await Product.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit);
  
      const count = await Product.countDocuments(filter);
  
      console.log("Products found:", products.length);
  
      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Product = require('../Models/Product');

// // Get products with pagination, searching, filtering, and sorting
// router.get('/products', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         // Query parameters for filtering and searching
//         const searchQuery = req.query.search || '';
//         const category = req.query.category || '';
//         const brand = req.query.brand || ''; // New brand filter
//         const minPrice = parseInt(req.query.minPrice) || 0;
//         const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
//         const sort = req.query.sort || 'createdAt'; // Default sort by creation date
//         const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // Sort order

//         const filter = {
//             name: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search
//             category: { $regex: category, $options: 'i' },
//             brand: { $regex: brand, $options: 'i' }, // Add brand filter
//             price: { $gte: minPrice, $lte: maxPrice }
//         };

//         // Fetch products with the applied filters, sorting, and pagination
//         const products = await Product.find(filter)
//             .sort({ [sort]: sortOrder })
//             .skip(skip)
//             .limit(limit)
//             .exec();

//         // Get the total count of products for pagination metadata
//         const total = await Product.countDocuments(filter);

//         res.json({
//             products,
//             totalPages: Math.ceil(total / limit),
//             currentPage: page
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// module.exports = router;
