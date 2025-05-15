const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.user.id).select('-password');
    
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ msg: "Not authorized, token failed", error: error.message });
    }
  } else {
    return res.status(401).json({ msg: 'Not authorized, no token provided' });
  }
};



// check if the user is admin
exports.admin = (req, res, next) => {
 if(req.user && req.user.role === 'admin') {
  next(); 
 }else{
  res.status(401).json({ msg: 'Not authorized as an admin' });
 }
}

