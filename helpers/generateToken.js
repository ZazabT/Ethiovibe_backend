const jwt = require('jsonwebtoken');


// Helper function to generate JWT token

const generateToken = (userId, expiresIn = '1h') => {
    return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn });
  };
  
  module.exports = generateToken;