const express = require('express');
const router = express.Router();
const ContactContent = require('../models/ContactContent');
const auth = require('../middleware/auth');
const { isValidEmail, badRequest } = require('../utils/validate');

// Get contact content (public)
router.get('/', async (req, res) => {
  try {
    let content = await ContactContent.findOne();
    if (!content) {
      content = new ContactContent();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact content (admin only)
router.put('/', auth, async (req, res) => {
  try {
    const errors = [];
    if (req.body.email !== undefined && !isValidEmail(req.body.email)) {
      errors.push({ field: 'email', message: 'Enter a valid email address' });
    }
    if (errors.length) return badRequest(res, errors);

    let content = await ContactContent.findOne();
    if (!content) {
      content = new ContactContent(req.body);
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

