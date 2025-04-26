const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send('WELCOME TO ETHIOVIBE');
});

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
