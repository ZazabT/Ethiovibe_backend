const User = require('../models/User.model');
const { validationResult } = require('express-validator')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            msg: 'Users fetched successfully',
            totalUsers: users.length,
            users
        })
    } catch (error) {
        console.error("Admin get User error:", error);
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
}


exports.createUser = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If validation fails, return errors
        return res.status(400).json({ error: errors.array() });
    }

    // Get data from body
    const { name, email, password } = req.body;

    try {
        // Check if user already exists

        const existingUser = await User.find({ email });

        if (existingUser) {
            return res.status(400).json({ error: { msg: 'User already exists with this email' } });
        }

        // If not exists and pass all validation, create a new user
        const user = new User({
            name,
            email,
            password
        });

        // Save user to database
        await user.save();

        // Return 201 status saying User registered successfully
        res.status(201).json({
            msg: 'User registered successfully', user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {

        console.error("Admin creating user error:", error);
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
}

exports.updateUser = async (req, res) => {

    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If validation fails, return errors
        return res.status(400).json({ error: errors.array() });
    }

    // Get data from body
    const { name, email, password } = req.body;

    // get user id from req.params
    const { id } = req.params;

    try {
        // check if user exists
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                msg: 'User not found'
            })
        }

        // updated user 
        const updatedUserData = new User({
            name,
            email,
            password 
        });

        // update user
        const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, { new: true });

        res.status(200).json({
            msg: 'User updated successfully',
            user: updatedUser
        })

    } catch (error) {
        console.error("Admin update user error:", error);
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
     
    }
}

exports.deleteUser = async (req, res) => {
    // get user id from req.params
    const { id } = req.params;

    // check if user exists
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            msg: 'User not found'
        })
    }

    try {
        // delete user
        await user.deleteOne();

        res.status(200).json({
            msg: 'User deleted successfully'
        })
    } catch (error) {
        console.error("Admin delete user error:", error);
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
}

