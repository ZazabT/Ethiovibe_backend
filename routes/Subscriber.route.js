const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth.middleware');
const {subscribe, getAllsubscribers} = require('../controllers/Order.controller');


// @route GET /api/subscribe/
// @desc get all subscribers
// @access Privet

router.get('/', protect, getAllsubscribers);


// @route POST /api/subscribe/
// @desc subscribe
// @access public

router.post('/', subscribe);