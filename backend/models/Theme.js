const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    default: '#667eea'
  },
  secondaryColor: {
    type: String,
    default: '#764ba2'
  },
  accentColor: {
    type: String,
    default: '#4CAF50'
  },
  textColor: {
    type: String,
    default: '#333333'
  },
  backgroundColor: {
    type: String,
    default: '#f5f5f5'
  },
  // Optional background image used under glass cards (URL or /uploads path)
  backgroundImage: {
    type: String,
    default: ''
  },
  // Header gradient colors (used to build headerBackground)
  headerGradientStart: {
    type: String,
    default: '#667eea'
  },
  headerGradientEnd: {
    type: String,
    default: '#764ba2'
  },
  headerBackground: {
    type: String,
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  navbarBackground: {
    type: String,
    default: '#1a1a1a'
  },
  buttonPrimary: {
    type: String,
    default: '#4CAF50'
  },
  buttonSecondary: {
    type: String,
    default: '#2196F3'
  },
  // Card look: normal | glass | metallic | wood
  cardStyle: {
    type: String,
    enum: ['normal', 'glass', 'metallic', 'wood'],
    default: 'normal'
  },
  // Card shape: round-rectangle | parallelogram | rectangle | square | circle | pill
  cardShape: {
    type: String,
    enum: ['round-rectangle', 'parallelogram', 'rectangle', 'square', 'circle', 'pill'],
    default: 'round-rectangle'
  },
  // Font stack for whole site (CSS font-family value)
  fontFamily: {
    type: String,
    default: 'Georgia, "Times New Roman", serif'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema);

