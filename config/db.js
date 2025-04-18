const mongoose = require('mongoose');


const connectDB = async (MONGO_URI) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
