const express = require('express');
const route = express.Router();
const User = require('../models/User.model');
const {registerValidation} =  require('../validators/user.validator')

//@route POST /api/users/register
//@desc Register ot create new user
//@access public

route.post('register' , registerValidation , );


// export the route
module.exports = route;