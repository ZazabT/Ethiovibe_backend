const express = require('express');
const route = express.Router();
const User = require('../models/User.model');
const {registerValidation , logValidation} =  require('../validators/user.validator');
const {registerUser , loginUser ,getProfile} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');


//@route POST /api/users/register
//@desc Register or create new user
//@access public
route.post('/register' , registerValidation , registerUser);


//@route POST /api/users/login
//@desc login user to the website
//@access public
route.post('/login' , logValidation , loginUser);

//@route GET /api/users/profile
//@desc get profile of a user 
//@access protected
route.get('/profile' , protect , getProfile );





// export the route
module.exports = route;



