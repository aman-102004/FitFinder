const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create a login token for the user
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register  — create new account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, goal } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all fields.' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email already registered. Please login.' });

    const user  = await User.create({ name, email, password, goal });
    const token = makeToken(user._id);

    res.status(201).json({
      message: 'Account created!',
      token,
      user: { id: user._id, name: user.name, email: user.email, goal: user.goal }
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Email already exists.' });
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login  — login with email + password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please enter email and password.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ message: 'Wrong email or password.' });

    const ok = await user.comparePassword(password);
    if (!ok)
      return res.status(401).json({ message: 'Wrong email or password.' });

    const token = makeToken(user._id);
    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, goal: user.goal }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me  — get currently logged in user
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
