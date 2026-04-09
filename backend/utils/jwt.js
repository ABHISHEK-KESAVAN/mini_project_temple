const jwt = require('jsonwebtoken');

const DEV_FALLBACK_SECRET = 'dev-only-jwt-secret-change-me';
let hasWarnedAboutFallbackSecret = false;

const getJwtSecret = () => {
  const configuredSecret = process.env.JWT_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }

  if (!hasWarnedAboutFallbackSecret) {
    hasWarnedAboutFallbackSecret = true;
    console.warn('[Auth] JWT_SECRET is not set. Using an insecure development fallback secret.');
  }

  return DEV_FALLBACK_SECRET;
};

const signAuthToken = (user) => jwt.sign(
  { userId: user._id.toString(), role: user.role },
  getJwtSecret(),
  { expiresIn: '7d' }
);

module.exports = {
  getJwtSecret,
  signAuthToken
};
