const express = require('express');
const User    = require('../models/User');
const Gym     = require('../models/Gym');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites', 'name location fees rating icon');
  res.json(user);
});

// POST /api/users/favorites/:gymId  — save or remove a gym
router.post('/favorites/:gymId', protect, async (req, res) => {
  try {
    const gym  = await Gym.findById(req.params.gymId);
    if (!gym) return res.status(404).json({ message: 'Gym not found.' });

    const user  = await User.findById(req.user._id);
    const isFav = user.favorites.map(String).includes(req.params.gymId);

    if (isFav) {
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.gymId);
      await user.save();
      res.json({ message: 'Removed from favorites.', isFavorite: false });
    } else {
      user.favorites.push(req.params.gymId);
      await user.save();
      res.json({ message: 'Added to favorites!', isFavorite: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
