const express = require('express');
const router = express.Router();
const { admin , protect } = require('../middleware/auth.middleware');
const { getAllOrders ,deleteOrder ,updateOrder} = require('../controllers/adminOrder.controller')

// @route GET /api/admin/orders
// @desc Get all orders (admin only)
// @access Private (Admin)
router.get('/' , admin , protect , getAllOrders);




// @route PUT /api/admin/orders/:id
// @desc Update a orders (admin only)
// @access Private (Admin)
router.put('/:id' , admin , protect , updateOrder);


// @route DELETE /api/admin/orders/:id
// @desc Delete a orders (admin only)
// @access Private (Admin)
router.delete('/:id' , admin , protect , deleteOrder);




module.exports = router;