// Reset or create an admin user with a known password.
// Usage:
//   node backend/scripts/resetAdminPassword.js            (uses admin / admin123)
//   node backend/scripts/resetAdminPassword.js admin myPass123

const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');

// Load backend .env (so we use the same MONGODB_URI as the server)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/temple_management';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB:', uri);

    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    let user = await User.findOne({ username });
    if (!user) {
      console.log(`No user found with username "${username}". Creating a new admin user...`);
      user = new User({ username, password, role: 'admin' });
    } else {
      console.log(`User "${username}" found. Updating password...`);
      user.password = password; // will be hashed by pre-save hook
      user.role = 'admin';
    }

    await user.save();
    console.log('✅ Admin user is ready:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\nYou can now log in on /admin/login with these credentials.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin password:', err);
    process.exit(1);
  }
}

main();

