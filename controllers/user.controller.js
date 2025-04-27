const User = require('../models/User.model');
const generateToken = require('../helpers/generateToken'); 
const { validationResult } = require('express-validator');

// Register user controller
exports.registerUser = async (req, res) => {
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
    const existingUser = await User.findOne({ email });

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
    res.status(201).json({ msg: 'User registered successfully', user : {
      id : user._id,
      name : user.name,
      email : user.email,
      role : user.role,
    } });
  } catch (error) {
    console.error({ error: error.message });

    // Send structured error response
    return res.status(500).json({
      error: 'Server Error',
      msg: error.message || 'An unexpected error occurred',
    });
  }
};

// Login user controller
exports.loginUser = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If validation fails, return errors
    return res.status(400).json({ error: errors.array() });
  }

  // Get data from body
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: [{ msg: 'User with this email doesn\'t exist. Try to register.' }] });
    }

    // Check if the password is correct using the matchPassword method
    const isMatch = await existingUser.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: [{ msg: 'Invalid password' }] });
    }

    // Generate the access token (valid for 1 hour)
    const accessToken = generateToken({ id: existingUser._id, role: existingUser.role }, '1h');

    // Generate the refresh token (valid for 7 days)
    const refreshToken = generateToken({ id: existingUser._id, role: existingUser.role }, '7d');

    // Return the response with the tokens and user data (excluding password)
    res.status(200).json({
      msg: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role : existingUser.role,
      },
    });
  } catch (error) {
    console.error({ error: error.message });

    // Send structured error response
    return res.status(500).json({
      error: 'Server Error',
      msg: error.message || 'An unexpected error occurred',
    });
  }
};
