const User = require('../models/User');

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.user.userId).select('username role');
    if (!user) {
      return res.status(401).json({ message: 'Authenticated user no longer exists' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.currentUser = user;
    req.user.role = user.role;
    next();
  } catch (error) {
    console.error('[Auth] Admin access check failed:', error.message);
    res.status(500).json({ message: 'Unable to verify admin access' });
  }
};

module.exports = requireAdmin;
