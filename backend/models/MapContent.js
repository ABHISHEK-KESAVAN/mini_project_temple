const mongoose = require('mongoose');

const mapContentSchema = new mongoose.Schema({
  templeAddress: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  directions: {
    type: String,
    default: ''
  },
  insideTempleMap: {
    image: String,
    description: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MapContent', mapContentSchema);

