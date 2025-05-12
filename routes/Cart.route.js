const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();
const {
    addToCart,
    getCart,
    updateQuantity,
    deleteCartitem,
    mergeCart
} = require('../controllers/Cart.controller');
const {
    addToCartValidation,
    updateCartValidation,
    deleteCartValidation
} = require('../validators/cart.validator');

// @route POST /api/cart/
// @desc Add a product to the cart
// @access Public
router.post('/', addToCartValidation, addToCart);

// @route PUT /api/cart/
// @desc update quantity of a product for guest and logged in user
// @access Public
router.put('/', updateCartValidation, updateQuantity);

// @route DELETE /api/cart/
// @desc delete a product/cartitem from a cart 
// @access public
router.delete('/', deleteCartValidation, deleteCartitem);

// @route GET /api/cart/
// @desc Get all products in the cart
// @access Public
router.get('/', getCart);

// @route POST /api/cart/merge
// @desc merge the guest cart to the user cart
// @access private
router.post('/merge', protect, mergeCart);

module.exports = router;