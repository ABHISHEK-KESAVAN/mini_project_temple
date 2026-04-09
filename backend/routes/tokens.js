const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Token = require('../models/Token');
const TokenCounter = require('../models/TokenCounter');
const TokenSettings = require('../models/TokenSettings');
const Pooja = require('../models/Pooja');
const QRCode = require('qrcode');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { isNonEmptyString, isValidIndianMobile10, isValidObjectId, badRequest, clampString } = require('../utils/validate');

const DEFAULTS = { limitType: 'day', limitValue: 500, expiryMinutes: 120 };

const getDateKey = (date = new Date()) => {
  const y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}${m}${d}`; // YYYYMMDD
};

const formatTokenNumber = (dateKey, seq) => {
  return `${dateKey}-${seq.toString().padStart(4, '0')}`; // 0001..10000
};

const markExpiredIfNeeded = async (tokenDoc) => {
  if (!tokenDoc) return tokenDoc;
  if (tokenDoc.status === 'pending' && tokenDoc.expiresAt && tokenDoc.expiresAt.getTime() < Date.now()) {
    tokenDoc.status = 'expired';
    await tokenDoc.save();
  }
  return tokenDoc;
};

// Create token (public - for devotees)
router.post('/', async (req, res) => {
  try {
    const { devoteeName, mobileNumber, poojas } = req.body;

    const errors = [];
    if (!isNonEmptyString(devoteeName) || devoteeName.trim().length < 2) errors.push({ field: 'devoteeName', message: 'Name must be at least 2 characters' });
    if (!isValidIndianMobile10(mobileNumber)) errors.push({ field: 'mobileNumber', message: 'Mobile number must be exactly 10 digits' });
    if (!Array.isArray(poojas) || poojas.length === 0) errors.push({ field: 'poojas', message: 'Select at least 1 pooja' });
    if (Array.isArray(poojas) && poojas.length > 20) errors.push({ field: 'poojas', message: 'Too many poojas selected (max 20)' });
    if (errors.length) return badRequest(res, errors);

    // Calculate total amount and get pooja details
    let totalAmount = 0;
    const poojaDetails = [];

    for (const poojaItem of poojas) {
      if (!poojaItem || !isValidObjectId(poojaItem.poojaId)) {
        return badRequest(res, [{ field: 'poojas', message: 'Invalid poojaId in selection' }]);
      }
      const pooja = await Pooja.findById(poojaItem.poojaId);
      if (!pooja || !pooja.isActive) {
        return res.status(400).json({ message: `Pooja ${poojaItem.poojaId} not found or inactive` });
      }
      totalAmount += pooja.price;
      poojaDetails.push({
        poojaId: pooja._id,
        poojaName: pooja.name,
        price: pooja.price
      });
    }

    // Admin-configured limit and expiry
    let settings = await TokenSettings.findOne();
    if (!settings) {
      settings = await TokenSettings.create(DEFAULTS);
    }
    const limitType = settings.limitType || 'day';
    const limitValue = Math.max(1, Number(settings.limitValue) || 500);
    const expiryMinutes = Math.max(5, Math.min(10080, Number(settings.expiryMinutes) || 120));

    const now = new Date();
    const dateKey = getDateKey(now);

    if (limitType === 'hour') {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const countLastHour = await Token.countDocuments({ createdAt: { $gte: oneHourAgo } });
      if (countLastHour >= limitValue) {
        return res.status(429).json({
          message: `Token limit reached (${limitValue} per hour). Please try again later.`
        });
      }
    }

    const counter = await TokenCounter.findOneAndUpdate(
      { dateKey },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (limitType === 'day' && counter.seq > limitValue) {
      return res.status(429).json({
        message: `Daily token limit reached (${limitValue}). Please try again tomorrow.`
      });
    }

    const dailySeq = counter.seq;
    const tokenNumber = formatTokenNumber(dateKey, dailySeq);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    const tokenData = {
      tokenNumber,
      dateKey,
      dailySeq,
      devoteeName: clampString(devoteeName, 100),
      mobileNumber: mobileNumber.trim(),
      poojas: poojaDetails,
      totalAmount,
      expiresAt
    };

    // Pre-generate the document _id so we can embed it in the QR URL
    // before the Token document is created (avoids 'token before init' error)
    const tokenId = new mongoose.Types.ObjectId();
    tokenData._id = tokenId;

    // Generate QR code — encode a URL so scanning opens the token view page
    const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
    const tokenViewUrl = `${frontendOrigin}/token/view/${tokenId}`;
    const qrCode = await QRCode.toDataURL(tokenViewUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300
    });

    tokenData.qrCode = qrCode;

    const token = new Token(tokenData);
    await token.save();

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tokens (admin only)
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    const tokens = await Token.find(query)
      .populate('poojas.poojaId')
      .sort({ createdAt: -1 });

    // Mark expired tokens (best-effort)
    const now = Date.now();
    const toExpire = tokens.filter(t => t.status === 'pending' && t.expiresAt && t.expiresAt.getTime() < now);
    if (toExpire.length) {
      await Token.updateMany(
        { _id: { $in: toExpire.map(t => t._id) }, status: 'pending' },
        { $set: { status: 'expired' } }
      );
      // reflect in response
      toExpire.forEach(t => (t.status = 'expired'));
    }

    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats (admin only) - must be before GET /:id
router.get('/stats/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    const totalTokens = await Token.countDocuments();
    const pendingTokens = await Token.countDocuments({ status: 'pending' });
    const usedTokens = await Token.countDocuments({ status: 'used' });
    const todayTokens = await Token.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    const totalRevenue = await Token.aggregate([
      { $match: { status: 'used' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalTokens,
      pendingTokens,
      usedTokens,
      todayTokens,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify token by token number
router.get('/verify/:tokenNumber', auth, requireAdmin, async (req, res) => {
  try {
    let token = await Token.findOne({ tokenNumber: req.params.tokenNumber })
      .populate('poojas.poojaId');
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    token = await markExpiredIfNeeded(token);
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single token
router.get('/:id', async (req, res) => {
  try {
    let token = await Token.findById(req.params.id).populate('poojas.poojaId');
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    token = await markExpiredIfNeeded(token);
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark token as used (admin only)
router.put('/:id/use', auth, requireAdmin, async (req, res) => {
  try {
    const tokenDoc = await Token.findById(req.params.id);
    if (!tokenDoc) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Cannot use expired tokens
    const now = Date.now();
    if (tokenDoc.status === 'pending' && tokenDoc.expiresAt && tokenDoc.expiresAt.getTime() < now) {
      tokenDoc.status = 'expired';
      await tokenDoc.save();
      return res.status(400).json({ message: 'Token is expired and cannot be marked as used.' });
    }

    tokenDoc.status = 'used';
    tokenDoc.usedAt = new Date();
    const token = await tokenDoc.save();
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update token status (admin only) – for corrections (pending/cancelled)
router.put('/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Only pending or cancelled are allowed here.' });
    }

    const tokenDoc = await Token.findById(req.params.id);
    if (!tokenDoc) {
      return res.status(404).json({ message: 'Token not found' });
    }

    tokenDoc.status = status;
    if (status !== 'used') {
      tokenDoc.usedAt = undefined;
    }

    const token = await tokenDoc.save();
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

