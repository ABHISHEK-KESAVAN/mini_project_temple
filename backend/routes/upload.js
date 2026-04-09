const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const path = require('path');

// Single image upload (admin only)
router.post('/image', auth, requireAdmin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      console.warn('Upload attempt with no file attached');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the URL to access the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log('Image uploaded successfully:', fileUrl);
    res.json({
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Multiple images upload (admin only)
router.post('/images', auth, requireAdmin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));

    res.json({
      message: 'Images uploaded successfully',
      files: fileUrls
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

