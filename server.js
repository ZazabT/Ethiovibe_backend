const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ✅ Proper CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ehiovibe.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow no-origin requests (e.g. Postman) or matching domains
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Apply once
app.use(cors(corsOptions));

// ✅ Helmet setup with CORP support
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(morgan('dev'));

// ✅ REMOVE this — CORS is handled above!
// app.use((req, res, next) => { ... });

// Routes
app.use('/api/users', require('./routes/user.route'));
app.use('/api/products', require('./routes/product.route'));
app.use('/api/carts', require('./routes/Cart.route'));
app.use('/api/checkouts', require('./routes/Checkout.route'));
app.use('/api/orders', require('./routes/Order.route'));
app.use('/api/subscribers', require('./routes/Subscriber.route'));
app.use('/api/upload', require('./routes/Upload.route'));
app.use('/api/admin/products', require('./routes/adminProduct.route'));
app.use('/api/admin/users', require('./routes/adminUser.route'));
app.use('/api/admin/orders', require('./routes/adminOrder.route'));

// Server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
