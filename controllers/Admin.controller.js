const User = require('../models/User.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            msg: 'Users fetched successfully',
            totalUsers: users.length,
            users
        });
    } catch (error) {
        console.error("Admin get User error:", error);
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
};

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { name, email, password, role = 'customer' } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: { msg: 'User already exists with this email' } });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject(); // remove password

        res.status(201).json({
            msg: 'User registered successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Admin creating user error:", error);
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { name, email, password, role } = req.body;
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (email) updateData.email = email.trim();
        if (role) updateData.role = role;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: { msg: 'User not found' } });
        }

        res.status(200).json({
            msg: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error("Admin update user error:", error);
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({
            msg: 'User deleted successfully',
            user
        });
    } catch (error) {
        console.error("Admin delete user error:", error);
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
};
