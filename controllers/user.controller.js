const User = require('../models/User.model');

const {validationResult} = require('express-validator')

// register user controller

exports.registerUser = async ( req , res) =>{
     // Check validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If validation fails, return errors
    return res.status(400).json({ errors: errors.array() });
  }

  // get data from body
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser  = await User.findOne({ email });

    if(existingUser) {
      return res.status(400).json({ errors: [{ msg: 'User already exists with this email' }] });
    }

     // If not exists,and pass all validation create a new user
     const user = new User({
        name,
        email,
        password
     });

     // Save user to database
     await user.save();

     // Return 201 status saying User registered successfully
     res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}