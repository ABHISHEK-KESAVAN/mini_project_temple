const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true,
    unique: true
  },
  // For daily reset logic + faster queries
  dateKey: {
    type: String,
    required: true,
    index: true
  },
  // 1..10000 sequence per dateKey
  dailySeq: {
    type: Number,
    required: true
  },
  devoteeName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  poojas: [{
    poojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pooja',
      required: true
    },
    poojaName: String,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'used', 'cancelled', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  qrCode: {
    type: String,
    default: ''
  },
  usedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure per-day sequence is unique (prevents duplicates in concurrent token creation)
tokenSchema.index({ dateKey: 1, dailySeq: 1 }, { unique: true });

module.exports = mongoose.model('Token', tokenSchema);

