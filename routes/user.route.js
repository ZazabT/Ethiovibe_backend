const express = require('express');
const route = express.Router();
const User = require('../models/User.model');
const {registerValidation , logValidation} =  require('../validators/user.validator');
const {registerUser , loginUser} = require('../controllers/user.controller')

//@route POST /api/users/register
//@desc Register or create new user
//@access public
route.post('/register' , registerValidation , registerUser);


//@route POST /api/users/login
//@desc login user to the website
//@access public
route.post('/login' , logValidation , loginUser);




// export the route
module.exports = route;