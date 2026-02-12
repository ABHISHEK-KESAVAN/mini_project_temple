const mongoose = require('mongoose');

const contactContentSchema = new mongoose.Schema({
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
  helpInstructions: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactContent', contactContentSchema);

