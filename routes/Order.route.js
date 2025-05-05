const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth.middleware');


// @route POST /api/my-order/
// @desc get my order
// @access Privet

router.get('my-order', protect, getMyOrder);