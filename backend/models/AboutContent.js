const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: 'About Our Temple'
  },
  heroSubtitle: {
    type: String,
    default: 'A Sacred Journey Through Devotion & Heritage'
  },
  hero: {
    backgroundImage: {
      type: String,
      default: ''
    }
  },
  history: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({
      text: '',
      image: ''
    })
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

