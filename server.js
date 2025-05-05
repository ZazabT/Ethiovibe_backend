const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const helmet = require('helmet');
const morgan = require('morgan');

// Routes
const userRoute = require('./routes/user.route');
const productRoute = require('./routes/product.route');
const cartRoute = require('./routes/Cart.route');
const checkoutRoute = require('./routes/Checkout.route');
const orderRoute = require('./routes/Order.route');
const subscriberRoute = require('./routes/Subscriber.route');
const app = express();

// Middlewares
app.use(helmet()); // Adds security headers to responses
app.use(express.json());
app.use(cors());

// Use Morgan for logging requests in the development environment
app.use(morgan('dev'));

// api routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/checkouts', checkoutRoute);
app.use('/api/orders', orderRoute);
app.use('/api/subscribers', subscriberRoute);

const PORT = process.env.PORT || 3000;


// Start server
const startServer = async () => {
  try {
    await connectDB(); // Wait for DB to connect
    app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();
