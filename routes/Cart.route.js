const express = require('express');
const router = express.Router();
const {addToCart , getCart} = require('../controllers/Cart.controller')
const route = require('./Cart.route');


// @route POST /api/cart/
// @desc Add a product to the cart
// @access Public
router.post('/', addToCart);

// @route GET /api/cart/
// @desc Get all products in the cart
// @access Public
router.get('/', getCart);






module.exports = router;