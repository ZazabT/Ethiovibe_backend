const express = require('express');
const router = express.Router();
const { admin , protect } = require('../middleware/auth.middleware');
const Product = require('../models/Product.model');

// @route GET /api/admin/products
// @desc Get all products (admin only)
// @access Private (Admin)
router.get('/' , admin , protect , async (req , res) => {
    try {
        const products = await Product.find() 
            .sort({ createdAt: -1 }) 
        const totalProducts = products.length;
        
        res.status(200).json({
            message: 'Products fetched successfully',
            products,
            totalProducts 
        });

    } catch (error) {
        console.error("Admin get products error:", error);
        res.status(500).json({ 
            message: 'Error fetching products', 
            error: error.message 
        });
    }
});




module.exports = router;