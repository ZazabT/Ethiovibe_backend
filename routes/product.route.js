const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const protect = require('../middleware/auth.middleware')