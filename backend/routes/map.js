const express = require('express');
const router = express.Router();
const MapContent = require('../models/MapContent');
const auth = require('../middleware/auth');
const { isNonEmptyString, badRequest } = require('../utils/validate');

// Get map content (public)
router.get('/', async (req, res) => {
  try {
    let content = await MapContent.findOne();
    if (!content) {
      content = new MapContent({
        templeAddress: 'Temple Address',
        latitude: 0,
        longitude: 0
      });
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update map content (admin only)
router.put('/', auth, async (req, res) => {
  try {
    const errors = [];
    if (!isNonEmptyString(req.body.templeAddress)) {
      errors.push({ field: 'templeAddress', message: 'Temple address is required' });
    }
    const lat = Number(req.body.latitude);
    if (req.body.latitude !== undefined && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
      errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
    }
    const lng = Number(req.body.longitude);
    if (req.body.longitude !== undefined && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
      errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
    }
    if (errors.length) return badRequest(res, errors);

    let content = await MapContent.findOne();
    if (!content) {
      content = new MapContent(req.body);
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

