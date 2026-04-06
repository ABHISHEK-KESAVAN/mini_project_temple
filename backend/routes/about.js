const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const auth = require('../middleware/auth');

const normalizeAboutContent = (content) => {
  const source = content?.toObject ? content.toObject() : (content || {});
  const history = typeof source.history === 'string'
    ? { text: source.history, image: '' }
    : {
        text: source.history?.text || '',
        image: source.history?.image || ''
      };

  return {
    ...source,
    hero: {
      backgroundImage: source.hero?.backgroundImage || ''
    },
    history
  };
};

// Get about content (public)
router.get('/', async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = new AboutContent();
      await content.save();
    }
    res.json(normalizeAboutContent(content));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update about content (admin only)
router.put('/', auth, async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    const payload = normalizeAboutContent(req.body);

    if (!content) {
      content = new AboutContent(payload);
    } else {
      Object.assign(content, payload);
    }
    await content.save();
    res.json(normalizeAboutContent(content));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

