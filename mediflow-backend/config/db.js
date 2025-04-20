// mediflow-backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.info("Connecting to database..." + process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.info("Database connected");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

