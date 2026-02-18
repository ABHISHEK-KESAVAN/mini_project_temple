const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  templeName: {
    type: String,
    default: 'Temple Name'
  },
  templeLogo: {
    type: String,
    default: ''
  },
  // e.g. "16/9", "4/3", "1" - same ratio for slider and gallery
  bannerAspectRatio: {
    type: String,
    default: '16/9'
  },
  banners: [{
    image: String,
    title: String,
    description: String
  }],
  welcomeMessage: {
    type: String,
    default: 'Welcome to our temple'
  },
  announcements: [{
    title: String,
    message: String,
    date: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  highlightCards: [{
    title: String,
    description: String,
    icon: String,
    link: String
  }],
  // Short text for home page "About" block; "See more" links to /about
  aboutTeaser: {
    type: String,
    default: ''
  },
  // Hero section (full-width welcome)
  heroImage: { type: String, default: '' },
  heroWelcomeTitle: { type: String, default: 'Welcome' },
  heroCtaText: { type: String, default: 'View Poojas' },
  heroCtaLink: { type: String, default: '/poojas' },
  // About Us section (two-column: image + text)
  aboutImage: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeContent', homeContentSchema);

