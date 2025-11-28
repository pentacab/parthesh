// // config/db.js
// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1); // Exit with failure
//   }
// };

// export default connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI
    || 'mongodb+srv://Mayank20078657:Mayank20078657@cluster0.nxcumti.mongodb.net/AdminServiceforCabs';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

