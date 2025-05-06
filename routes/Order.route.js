const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth.middleware');
const {getMyOrders, getOrderDetails} = require('../controllers/Order.controller');


// @route GET /api/my-order/
// @desc get my order
// @access Privet

router.get('my-order', protect, getMyOrders);


// @route GET /api/my-order/
// @desc get order details by id
// @access Privet

router.get('my-order/:id', protect, getOrderDetails);


module.exports = router;