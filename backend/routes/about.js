const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const auth = require('../middleware/auth');

// Get about content (public)
router.get('/', async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = new AboutContent();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update about content (admin only)
router.put('/', auth, async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = new AboutContent(req.body);
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

