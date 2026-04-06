const express = require('express');
const router = express.Router();
const ContactContent = require('../models/ContactContent');
const MapContent = require('../models/MapContent');
const FooterContent = require('../models/FooterContent');
const auth = require('../middleware/auth');
const { isValidEmail, badRequest } = require('../utils/validate');

const SOCIAL_KEYS = ['facebook', 'twitter', 'instagram', 'youtube'];

const normalizeSocialLinks = (socialLinks = {}, fallback = {}) =>
  SOCIAL_KEYS.reduce((acc, key) => {
    acc[key] = socialLinks?.[key] || fallback?.[key] || '';
    return acc;
  }, {});

const buildContactPayload = (contact = {}, map = {}, footer = {}) => ({
  ...(contact?.toObject ? contact.toObject() : contact),
  heroTitle: contact?.heroTitle || 'Contact the Temple',
  heroSubtitle: contact?.heroSubtitle || 'Reach us for darshan timings, guidance, and temple visits',
  address: contact?.address || map?.templeAddress || footer?.address || '',
  phone: contact?.phone || contact?.templePhone || footer?.phone || '',
  templePhone: contact?.templePhone || contact?.phone || footer?.phone || '',
  email: contact?.email || footer?.email || '',
  officeTimings: contact?.officeTimings || '',
  latitude: contact?.latitude ?? map?.latitude ?? null,
  longitude: contact?.longitude ?? map?.longitude ?? null,
  directions: contact?.directions || map?.directions || '',
  helpInstructions: contact?.helpInstructions || '',
  socialLinks: normalizeSocialLinks(contact?.socialLinks, footer?.socialLinks)
});

// Get contact content (public)
router.get('/', async (req, res) => {
  try {
    let [content, mapContent, footerContent] = await Promise.all([
      ContactContent.findOne(),
      MapContent.findOne(),
      FooterContent.findOne()
    ]);

    if (!content) {
      content = new ContactContent();
      await content.save();
    }

    res.json(buildContactPayload(content, mapContent, footerContent));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact content (admin only)
router.put('/', auth, async (req, res) => {
  try {
    const errors = [];
    if (req.body.email !== undefined && !isValidEmail(req.body.email)) {
      errors.push({ field: 'email', message: 'Enter a valid email address' });
    }
    const lat = req.body.latitude === '' || req.body.latitude === null || req.body.latitude === undefined
      ? null
      : Number(req.body.latitude);
    if (req.body.latitude !== undefined && req.body.latitude !== '' && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
      errors.push({ field: 'latitude', message: 'Latitude must be between -90 and 90' });
    }
    const lng = req.body.longitude === '' || req.body.longitude === null || req.body.longitude === undefined
      ? null
      : Number(req.body.longitude);
    if (req.body.longitude !== undefined && req.body.longitude !== '' && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
      errors.push({ field: 'longitude', message: 'Longitude must be between -180 and 180' });
    }
    if (errors.length) return badRequest(res, errors);

    let [content, mapContent, footerContent] = await Promise.all([
      ContactContent.findOne(),
      MapContent.findOne(),
      FooterContent.findOne()
    ]);

    const payload = {
      ...req.body,
      phone: req.body.phone ?? req.body.templePhone ?? '',
      templePhone: req.body.templePhone ?? req.body.phone ?? '',
      latitude: lat,
      longitude: lng,
      socialLinks: normalizeSocialLinks(req.body.socialLinks)
    };

    if (!content) {
      content = new ContactContent(payload);
    } else {
      Object.assign(content, payload);
    }

    if (mapContent && (req.body.address !== undefined || req.body.latitude !== undefined || req.body.longitude !== undefined || req.body.directions !== undefined)) {
      mapContent.templeAddress = payload.address || mapContent.templeAddress;
      mapContent.latitude = lat ?? mapContent.latitude;
      mapContent.longitude = lng ?? mapContent.longitude;
      mapContent.directions = payload.directions ?? mapContent.directions;
    }

    if (footerContent && (req.body.phone !== undefined || req.body.email !== undefined || req.body.address !== undefined || req.body.socialLinks !== undefined)) {
      footerContent.phone = payload.phone;
      footerContent.email = payload.email;
      footerContent.address = payload.address;
      footerContent.socialLinks = {
        ...footerContent.socialLinks,
        ...payload.socialLinks
      };
    }

    await Promise.all([
      content.save(),
      mapContent ? mapContent.save() : Promise.resolve(),
      footerContent ? footerContent.save() : Promise.resolve()
    ]);

    res.json(buildContactPayload(content, mapContent, footerContent));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

