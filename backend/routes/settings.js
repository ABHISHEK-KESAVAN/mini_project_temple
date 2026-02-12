const express = require('express');
const router = express.Router();
const TokenSettings = require('../models/TokenSettings');
const auth = require('../middleware/auth');
const { badRequest } = require('../utils/validate');

const DEFAULTS = {
  limitType: 'day',
  limitValue: 500,
  expiryMinutes: 120
};

// Get token settings (public - so token page can show rules)
router.get('/token', async (req, res) => {
  try {
    let settings = await TokenSettings.findOne();
    if (!settings) {
      settings = await TokenSettings.create(DEFAULTS);
    }
    res.json({
      limitType: settings.limitType,
      limitValue: settings.limitValue,
      expiryMinutes: settings.expiryMinutes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update token settings (admin only)
router.put('/token', auth, async (req, res) => {
  try {
    const { limitType, limitValue, expiryMinutes } = req.body;
    const errors = [];

    if (limitType !== undefined && !['day', 'hour'].includes(limitType)) {
      errors.push({ field: 'limitType', message: 'limitType must be "day" or "hour"' });
    }
    const numLimit = limitValue !== undefined ? Number(limitValue) : undefined;
    if (numLimit !== undefined && (Number.isNaN(numLimit) || numLimit < 1 || numLimit > 100000)) {
      errors.push({ field: 'limitValue', message: 'Limit must be between 1 and 100000' });
    }
    const numExpiry = expiryMinutes !== undefined ? Number(expiryMinutes) : undefined;
    if (numExpiry !== undefined && (Number.isNaN(numExpiry) || numExpiry < 5 || numExpiry > 10080)) {
      errors.push({ field: 'expiryMinutes', message: 'Expiry must be between 5 and 10080 minutes (7 days)' });
    }
    if (errors.length) return badRequest(res, errors);

    let settings = await TokenSettings.findOne();
    if (!settings) {
      settings = new TokenSettings(DEFAULTS);
    }
    if (limitType !== undefined) settings.limitType = limitType;
    if (numLimit !== undefined) settings.limitValue = numLimit;
    if (numExpiry !== undefined) settings.expiryMinutes = numExpiry;
    await settings.save();

    res.json({
      limitType: settings.limitType,
      limitValue: settings.limitValue,
      expiryMinutes: settings.expiryMinutes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
