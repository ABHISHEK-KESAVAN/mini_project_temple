const express = require('express');
const router = express.Router();
const Pooja = require('../models/Pooja');
const auth = require('../middleware/auth');
const { isNonEmptyString, isValidUrlOrUploadPath, badRequest, clampString } = require('../utils/validate');

// Get all poojas (public - only active ones)
router.get('/', async (req, res) => {
  try {
    const poojas = await Pooja.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(poojas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all poojas including inactive (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const poojas = await Pooja.find().sort({ createdAt: -1 });
    res.json(poojas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single pooja
router.get('/:id', async (req, res) => {
  try {
    const pooja = await Pooja.findById(req.params.id);
    if (!pooja) {
      return res.status(404).json({ message: 'Pooja not found' });
    }
    res.json(pooja);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create pooja (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, timing, price, isActive, image } = req.body;
    const errors = [];

    if (!isNonEmptyString(name) || name.trim().length < 2) errors.push({ field: 'name', message: 'Pooja name must be at least 2 characters' });
    if (!isNonEmptyString(timing) || timing.trim().length < 2) errors.push({ field: 'timing', message: 'Timing is required' });
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 0) errors.push({ field: 'price', message: 'Price must be a number >= 0' });
    if (!isValidUrlOrUploadPath(image)) errors.push({ field: 'image', message: 'Image must be a valid http(s) URL or /uploads/... path' });

    if (errors.length) return badRequest(res, errors);

    const pooja = new Pooja({
      name: name.trim(),
      description: clampString(description || '', 2000),
      timing: timing.trim(),
      price: numPrice,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      image: (image || '').trim(),
    });
    await pooja.save();
    res.status(201).json(pooja);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update pooja (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, timing, price, isActive, image } = req.body;
    const errors = [];

    if (name !== undefined && (!isNonEmptyString(name) || name.trim().length < 2)) errors.push({ field: 'name', message: 'Pooja name must be at least 2 characters' });
    if (timing !== undefined && (!isNonEmptyString(timing) || timing.trim().length < 2)) errors.push({ field: 'timing', message: 'Timing is required' });
    if (price !== undefined) {
      const numPrice = Number(price);
      if (Number.isNaN(numPrice) || numPrice < 0) errors.push({ field: 'price', message: 'Price must be a number >= 0' });
    }
    if (image !== undefined && !isValidUrlOrUploadPath(image)) errors.push({ field: 'image', message: 'Image must be a valid http(s) URL or /uploads/... path' });

    if (errors.length) return badRequest(res, errors);

    const patch = { ...req.body };
    if (patch.name) patch.name = patch.name.trim();
    if (patch.timing) patch.timing = patch.timing.trim();
    if (patch.description !== undefined) patch.description = clampString(patch.description || '', 2000);
    if (patch.image !== undefined) patch.image = (patch.image || '').trim();
    if (patch.price !== undefined) patch.price = Number(patch.price);
    if (patch.isActive !== undefined) patch.isActive = !!patch.isActive;

    const pooja = await Pooja.findByIdAndUpdate(
      req.params.id,
      patch,
      { new: true, runValidators: true }
    );
    if (!pooja) {
      return res.status(404).json({ message: 'Pooja not found' });
    }
    res.json(pooja);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete pooja (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const pooja = await Pooja.findByIdAndDelete(req.params.id);
    if (!pooja) {
      return res.status(404).json({ message: 'Pooja not found' });
    }
    res.json({ message: 'Pooja deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

