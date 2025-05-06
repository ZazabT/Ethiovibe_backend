const express = require('express');
const router = express.Router();
const {protect , admin} = require('../middleware/auth.middleware');
const { getAllSubscribers , subscribe} = require('../controllers/Subscriber.controller')


// @route GET /api/subscribe/
// @desc get all subscribers
// @access Privet

router.get('/', protect, admin ,getAllSubscribers);


// @route POST /api/subscribe/
// @desc subscribe
// @access public

router.post('/', subscribe);



module.exports = router;