const express = require('express');
const router = express.Router();
const { admin , protect } = require('../middleware/auth.middleware');
const { createUser ,deleteUser ,getAllUsers ,updateUser} = require('../controllers/Admin.controller')

// @route GET /api/admin/users
// @desc Get all users (admin only)
// @access Private (Admin)
router.get('/users' , admin , protect , getAllUsers);


// @route POST /api/admin/users
// @desc Create a new user (admin only)
// @access Private (Admin)
router.post('/users' , admin , protect , createUser);


// @route PUT /api/admin/users/:id
// @desc Update a user (admin only)
// @access Private (Admin)
router.put('/users/:id' , admin , protect , updateUser);


// @route DELETE /api/admin/users/:id
// @desc Delete a user (admin only)
// @access Private (Admin)
router.delete('/users/:id' , admin , protect , deleteUser);