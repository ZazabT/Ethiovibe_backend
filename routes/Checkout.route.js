const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth.middleware');
const { createCheckout , checkoutPayed , finalizeCheckout} = require('../controllers/Checkout.controller')
 


// @route POST /api/checkout
// @desc create new checkout session
// @access Privet

router.post('' , protect , createCheckout);


// @route put /api/checkout/:id/pay
// @desc pay for checkout
// @access Privet

router.put(':id/pay', protect, checkoutPayed);


// @route POST /api/checkout/:id/finalize
// @desc finalize checkout and create order
// @access Privet

router.post(':id/finalize', protect, finalizeCheckout);




module.exports = router;
