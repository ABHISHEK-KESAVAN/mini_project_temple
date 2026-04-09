const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// Get theme (public)
router.get('/', async (req, res) => {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      theme = new Theme();
      await theme.save();
    }
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update theme (admin only)
router.put('/', auth, requireAdmin, async (req, res) => {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      theme = new Theme(req.body);
    } else {
      Object.assign(theme, req.body);
    }
    await theme.save();
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

