const jwt = require('jsonwebtoken');

// Helper function to generate JWT token

const generateToken = ( payload, expiresIn = '1h') => {
    return jwt.sign({ user: payload }, process.env.JWT_SECRET, { expiresIn });
  };
  
  module.exports = generateToken;