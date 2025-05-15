const express = require('express');
const router = express.Router();
const { admin , protect } = require('../middleware/auth.middleware');
const { createUser ,deleteUser ,getAllUsers ,updateUser} = require('../controllers/Admin.controller');
const { registerValidation , updateUserValidation } = require('../validators/user.validator')

// @route GET /api/admin/users
// @desc Get all users (admin only)
// @access Private (Admin)
router.get('/'  , protect , admin , getAllUsers);


// @route POST /api/admin/users
// @desc Create a new user (admin only)
// @access Private (Admin)
router.post('/' , protect , admin , createUser , registerValidation);


// @route PUT /api/admin/users/:id
// @desc Update a user (admin only)
// @access Private (Admin)
router.put('/:id'  , protect , admin , updateUser , updateUserValidation);


// @route DELETE /api/admin/users/:id
// @desc Delete a user (admin only)
// @access Private (Admin)
router.delete('/:id' , protect  , admin , deleteUser);




module.exports = router;