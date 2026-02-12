const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

const isValidUrlOrUploadPath = (v) => {
  if (!v) return true;
  if (typeof v !== 'string') return false;
  const s = v.trim();
  if (s === '') return true;
  if (s.startsWith('/uploads/')) return true;
  return /^https?:\/\/.+/i.test(s);
};

const isValidIndianMobile10 = (v) => typeof v === 'string' && /^[0-9]{10}$/.test(v.trim());

const isValidObjectId = (v) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);

const isValidEmail = (v) => !v || (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()));

const clampString = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : v);

const badRequest = (res, errors) => res.status(400).json({ message: 'Validation failed', errors });

module.exports = {
  isNonEmptyString,
  isValidUrlOrUploadPath,
  isValidIndianMobile10,
  isValidObjectId,
  isValidEmail,
  clampString,
  badRequest,
};


