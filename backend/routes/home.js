const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// Get home content (public)
router.get('/', async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = new HomeContent();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update home content (admin only)
router.put('/', auth, requireAdmin, async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = new HomeContent(req.body);
    } else {
      Object.assign(content, req.body);
    }
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

