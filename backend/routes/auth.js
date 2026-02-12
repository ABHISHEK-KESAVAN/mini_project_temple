const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { isNonEmptyString, badRequest } = require('../utils/validate');

// Register Admin (first time setup)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = [];
    if (!isNonEmptyString(username) || username.trim().length < 3) errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
    if (!isNonEmptyString(password) || password.trim().length < 6) errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    if (errors.length) return badRequest(res, errors);
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, password, role: 'admin' });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = [];
    if (!isNonEmptyString(username)) errors.push({ field: 'username', message: 'Username is required' });
    if (!isNonEmptyString(password)) errors.push({ field: 'password', message: 'Password is required' });
    if (errors.length) return badRequest(res, errors);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

