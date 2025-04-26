const mongoose = require('mongoose')
require('dotenv').config();
const mongodb_url = process.env.MONGODB_URL;
const connectDB = () => {
    return mongoose.connect(mongodb_url)
      .then(() => console.log('MongoDB connected successfully!'))
      .catch((error) => {
        console.error('MongoDB connection failed!!! Error:', error);
        process.exit(1);
      });
  };


module.exports = connectDB;





