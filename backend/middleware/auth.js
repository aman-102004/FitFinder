const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Use this on routes that need the user to be logged in
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ message: 'Please login first.' });

    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found.' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

// Use this on routes where login is optional
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token   = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user      = await User.findById(decoded.id);
    }
  } catch {}
  next();
};

module.exports = { protect, optionalAuth };
