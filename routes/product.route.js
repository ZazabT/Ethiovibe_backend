const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const {protect , admin} = require('../middleware/auth.middleware');
const {createProduct ,getAllProducts ,getProductById ,updateProduct ,deleteProduct} = require('../controllers/product.controller');
const {createProductValidator , updateProductValidator} = require('../validators/product.validator');

// @route GET /api/products
// @desc Get all products
// @access Public
router.get('/', getAllProducts);


// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get('/:id', getProductById);


// @route POST /api/products
// @desc Create a new product
// @access Private (admin)
router.post('/', protect, admin ,createProductValidator , createProduct )


// @route PUT /api/products/:id
// @desc Update a product
// @access Private (admin)
router.put('/:id', protect, admin ,updateProductValidator , updateProduct);


// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private (admin)
router.delete('/:id', protect, admin , deleteProduct);  




// export the router
module.exports = router;