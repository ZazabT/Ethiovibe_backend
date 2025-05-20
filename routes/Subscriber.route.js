const express = require('express');
const router = express.Router();
const {protect , admin} = require('../middleware/auth.middleware');
const { getAllSubscribers , subscribe , deleteSubscriber} = require('../controllers/Subscriber.controller')


// @route GET /api/subscribe/
// @desc get all subscribers
// @access Privet

router.get('/', protect, admin ,getAllSubscribers);


// @route POST /api/subscribe/
// @desc subscribe
// @access public

router.post('/', subscribe);


// @route DELETE /api/subscribe/
// @desc delete subscriber 
// @access Privet and admin

router.delete('/:id', protect, admin, deleteSubscriber);



module.exports = router;