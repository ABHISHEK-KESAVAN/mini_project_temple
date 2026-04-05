const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)          // trim 'Bearer ' prefix cleanly
      : authHeader;                  // fallback: raw value

    if (!token) {
      console.warn('[Auth] Request missing Authorization header:', req.method, req.originalUrl);
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const secret = process.env.JWT_SECRET || 'your_secret_key_here';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    // Log the specific JWT failure reason so it's visible in the server terminal
    console.error('[Auth] Token verification failed:', error.name, '-', error.message);
    res.status(401).json({ message: `Token is not valid: ${error.message}` });
  }
};

module.exports = auth;

