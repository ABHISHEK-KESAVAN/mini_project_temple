// Seed sample data for quick demo/testing
// Run: node backend/scripts/seedSample.js

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const HomeContent = require('../models/HomeContent');
const AboutContent = require('../models/AboutContent');
const MapContent = require('../models/MapContent');
const ContactContent = require('../models/ContactContent');
const Pooja = require('../models/Pooja');
const Theme = require('../models/Theme');
const TokenSettings = require('../models/TokenSettings');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini_project';
  await mongoose.connect(uri);

  // Home – sample content; admin can edit or remove
  await HomeContent.deleteMany({});
  await HomeContent.create({
    templeName: 'Sri Temple',
    templeLogo: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=200',
    welcomeMessage: 'Welcome to Sri Temple. Please maintain silence and follow temple guidelines.',
    bannerAspectRatio: '16/9',
    aboutTeaser: 'Our temple has served the community for decades. Visit for daily darshan, special poojas, and peaceful meditation. You can edit this text in Admin → Manage Home.',
    banners: [
      {
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920',
        title: 'Daily Darshan',
        description: 'Morning and evening darshan available every day.',
      },
      {
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
        title: 'Special Poojas',
        description: 'Book special poojas and avoid crowd at the counter.',
      },
      {
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1920',
        title: 'Temple Premises',
        description: 'View our gallery for more images.',
      },
    ],
    announcements: [
      {
        title: 'Festival Announcement',
        message: 'Special abhishekam on upcoming festival day. Please book token early.',
        date: new Date(),
        isActive: true,
      },
    ],
    highlightCards: [
      { title: 'Poojas', description: 'View and book available poojas', icon: '📿', link: '/poojas' },
      { title: 'Token', description: 'Generate token for selected poojas', icon: '🎫', link: '/token' },
      { title: 'Location', description: 'Find temple location and directions', icon: '📍', link: '/map' },
    ],
  });

  // About
  await AboutContent.deleteMany({});
  await AboutContent.create({
    hero: {
      backgroundImage: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1600&q=80'
    },
    history: {
      text: 'This temple has a long spiritual history and is visited by devotees daily.',
      image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80'
    },
    deityImportance: 'The presiding deity is worshipped for prosperity and peace.',
    rules: [{ rule: 'Maintain silence inside temple premises.' }, { rule: 'Dress modestly.' }],
    dailyTimings: {
      morning: '6:00 AM - 12:00 PM',
      afternoon: '12:00 PM - 4:00 PM',
      evening: '4:00 PM - 9:00 PM',
    },
    festivals: [{ name: 'Annual Festival', date: new Date(), description: 'Special poojas and celebrations.' }],
    spiritualInfo: 'Regular chanting and bhajans are conducted.',
    trustInfo: 'Managed by temple trust.',
  });

  // Map
  await MapContent.deleteMany({});
  await MapContent.create({
    templeAddress: 'Temple Street, Your City, Your State',
    latitude: 12.9716,
    longitude: 77.5946,
    directions: 'You can reach by bus/taxi. Nearest landmark: City Center.',
    insideTempleMap: {
      image: '',
      description: 'Inside navigation map can be uploaded by admin.',
    },
  });

  // Contact
  await ContactContent.deleteMany({});
  await ContactContent.create({
    heroTitle: 'Visit, Call, or Write to the Temple',
    heroSubtitle: 'All temple contact details, route guidance, and support information in one place.',
    address: 'Temple Street, Your City, Your State',
    phone: '+91 9876543210',
    templePhone: '+91 9876543210',
    officeTimings: '9:00 AM - 6:00 PM',
    emergencyContact: '+91 9123456780',
    email: 'temple@example.com',
    latitude: 12.9716,
    longitude: 77.5946,
    directions: 'Take the main road towards City Center.\nTurn at the temple arch near the market.\nParking is available beside the community hall.',
    helpInstructions: 'For help, contact office during timings. In emergency, use emergency contact.',
    socialLinks: {
      facebook: 'https://facebook.com/temple',
      instagram: 'https://instagram.com/temple',
      youtube: 'https://youtube.com/@temple'
    }
  });

  // Poojas – sample; admin can edit or remove
  await Pooja.deleteMany({});
  await Pooja.insertMany([
    { name: 'Archana', description: 'Standard archana', timing: '7:00 AM - 11:00 AM', price: 50, isActive: true, image: '' },
    { name: 'Abhishekam', description: 'Special abhishekam', timing: '6:30 AM - 8:00 AM', price: 300, isActive: true, image: '' },
    { name: 'Deepa Alankara', description: 'Evening deepa alankara', timing: '7:00 PM - 8:00 PM', price: 200, isActive: true, image: '' },
  ]);

  // Theme – default colors, card style, shape, font; admin can change in Manage Theme
  await Theme.deleteMany({});
  await Theme.create({
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColor: '#4CAF50',
    textColor: '#333333',
    backgroundColor: '#f5f5f5',
    headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    navbarBackground: '#1a1a1a',
    buttonPrimary: '#4CAF50',
    buttonSecondary: '#2196F3',
    cardStyle: 'normal',
    cardShape: 'round-rectangle',
    fontFamily: 'Georgia, "Times New Roman", serif',
  });

  // Token settings – admin can change in Token Limit & Expiry
  await TokenSettings.deleteMany({});
  await TokenSettings.create({
    limitType: 'day',
    limitValue: 500,
    expiryMinutes: 120,
  });

  console.log('✅ Sample data seeded successfully. Admin can edit or remove any content.');
  console.log(`Database: ${uri}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});


