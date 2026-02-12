// Script to create initial admin user
// Run with: node backend/scripts/createAdmin.js

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/temple_management');
    console.log('Connected to MongoDB');

    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const user = new User({
      username,
      password,
      role: 'admin'
    });

    await user.save();
    console.log(`Admin user created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('\nPlease change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

