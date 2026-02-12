const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  history: {
    type: String,
    default: ''
  },
  deityImportance: {
    type: String,
    default: ''
  },
  rules: [{
    rule: String
  }],
  dailyTimings: {
    morning: String,
    afternoon: String,
    evening: String
  },
  festivals: [{
    name: String,
    date: Date,
    description: String
  }],
  spiritualInfo: {
    type: String,
    default: ''
  },
  trustInfo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);

