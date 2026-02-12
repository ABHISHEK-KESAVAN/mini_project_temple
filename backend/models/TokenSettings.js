const mongoose = require('mongoose');

const tokenSettingsSchema = new mongoose.Schema({
  limitType: {
    type: String,
    enum: ['day', 'hour'],
    default: 'day'
  },
  limitValue: {
    type: Number,
    required: true,
    default: 500,
    min: 1,
    max: 100000
  },
  expiryMinutes: {
    type: Number,
    required: true,
    default: 120,
    min: 5,
    max: 10080
  }
}, { timestamps: true });

module.exports = mongoose.model('TokenSettings', tokenSettingsSchema);
