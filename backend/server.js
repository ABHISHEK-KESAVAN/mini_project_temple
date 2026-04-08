const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars before any config usage
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/temple_management';
const RETRY_DELAY_MS = Number(process.env.MONGODB_RETRY_DELAY_MS) || 10000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Serve uploaded images statically with CORS headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(uploadsDir));

// Test route
app.get("/", (req, res) => {
  res.send("Temple Backend API is running 🚀");
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/home', require('./routes/home'));
app.use('/api/about', require('./routes/about'));
app.use('/api/poojas', require('./routes/poojas'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/map', require('./routes/map'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/footer', require('./routes/footer'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/theme', require('./routes/theme'));
app.use('/api/settings', require('./routes/settings'));

let serverInstance = null;

const startServer = () => {
  if (serverInstance) return serverInstance;

  serverInstance = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  serverInstance.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the existing process or set a different PORT in backend/.env.`);
      return;
    }
    console.error('Express server error:', error);
  });

  return serverInstance;
};

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    startServer();
  } catch (error) {
    console.error('MongoDB connection failed');
    console.error(`Reason: ${error.name} - ${error.message}`);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }

    console.log(`Retrying MongoDB connection in ${Math.round(RETRY_DELAY_MS / 1000)}s...`);
    setTimeout(connectToMongo, RETRY_DELAY_MS);
  }
};

mongoose.connection.on('error', (error) => {
  console.error('MongoDB runtime error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

connectToMongo();

