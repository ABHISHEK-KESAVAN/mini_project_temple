const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { signAuthToken } = require('../utils/jwt');
const { isNonEmptyString, badRequest } = require('../utils/validate');

const normalizeUsername = (username) => (typeof username === 'string' ? username.trim() : '');
const buildAuthResponse = (user) => ({
  token: signAuthToken(user),
  user: user.toSafeObject()
});

// Register Admin (first time setup)
router.post('/register', async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username);
    const password = req.body.password;

    const errors = [];
    if (!isNonEmptyString(username) || username.length < 3) errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
    if (!isNonEmptyString(password) || password.trim().length < 6) errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    if (errors.length) return badRequest(res, errors);

    const adminExists = await User.exists({ role: 'admin' });
    if (adminExists) {
      return res.status(403).json({ message: 'Initial admin registration has already been completed' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, password, role: 'admin' });
    await user.save();

    res.json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username);
    const password = req.body.password;

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

    res.json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toSafeObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update current admin profile
router.put('/me', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const username = req.body.username === undefined
      ? user.username
      : normalizeUsername(req.body.username);
    const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';

    const errors = [];
    const usernameChanged = username !== user.username;
    const passwordChanged = newPassword.length > 0;

    if (!usernameChanged && !passwordChanged) {
      return res.status(400).json({ message: 'No profile changes were provided' });
    }

    if (!isNonEmptyString(username) || username.length < 3) {
      errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
    }

    if (!isNonEmptyString(currentPassword)) {
      errors.push({ field: 'currentPassword', message: 'Current password is required to save profile changes' });
    }

    if (passwordChanged && newPassword.trim().length < 8) {
      errors.push({ field: 'newPassword', message: 'New password must be at least 8 characters' });
    }

    if (usernameChanged) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        errors.push({ field: 'username', message: 'That username is already in use' });
      }
    }

    if (errors.length) return badRequest(res, errors);

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return badRequest(res, [{ field: 'currentPassword', message: 'Current password is incorrect' }]);
    }

    user.username = username;
    if (passwordChanged) {
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return badRequest(res, [{ field: 'newPassword', message: 'New password must be different from the current password' }]);
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      ...buildAuthResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

