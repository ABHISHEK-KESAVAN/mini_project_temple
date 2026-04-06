const mongoose = require('mongoose');

const contactContentSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: 'Contact the Temple'
  },
  heroSubtitle: {
    type: String,
    default: 'Reach us for darshan timings, guidance, and temple visits'
  },
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  templePhone: {
    type: String,
    default: ''
  },
  officeTimings: {
    type: String,
    default: ''
  },
  emergencyContact: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  directions: {
    type: String,
    default: ''
  },
  helpInstructions: {
    type: String,
    default: ''
  },
  socialLinks: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactContent', contactContentSchema);

