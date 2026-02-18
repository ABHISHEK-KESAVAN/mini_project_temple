const express = require('express');
const router = express.Router();
const FooterContent = require('../models/FooterContent');
const auth = require('../middleware/auth');
const { isValidEmail, badRequest } = require('../utils/validate');

// Get footer content (public)
router.get('/', async (req, res) => {
  try {
    let content = await FooterContent.findOne();
    if (!content) {
      content = new FooterContent();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update footer content (admin only)
router.put('/', auth, async (req, res) => {
  try {
    const errors = [];
    
    if (req.body.email !== undefined && req.body.email !== '' && !isValidEmail(req.body.email)) {
      errors.push({ field: 'email', message: 'Enter a valid email address' });
    }
    
    // Validate social links are URLs if provided
    if (req.body.socialLinks) {
      Object.keys(req.body.socialLinks).forEach(key => {
        const url = req.body.socialLinks[key];
        if (url && url !== '' && !/^https?:\/\/.+/.test(url)) {
          errors.push({ field: `socialLinks.${key}`, message: 'Must be a valid URL starting with http:// or https://' });
        }
      });
    }
    
    if (errors.length) return badRequest(res, errors);

    let content = await FooterContent.findOne();
    if (!content) {
      content = new FooterContent(req.body);
    } else {
      // Handle nested socialLinks update
      if (req.body.socialLinks) {
        content.socialLinks = { ...content.socialLinks, ...req.body.socialLinks };
      }
      // Update other fields
      Object.keys(req.body).forEach(key => {
        if (key !== 'socialLinks' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
          content[key] = req.body[key];
        }
      });
    }
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
