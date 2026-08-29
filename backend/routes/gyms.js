const express = require('express');
const Gym     = require('../models/Gym');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/gyms  — get all gyms with optional filters
router.get('/', async (req, res) => {
  try {
    const { city, sort, facility, minFee, maxFee } = req.query;
    const query = { isActive: true };

    if (city)     query.city     = { $regex: city, $options: 'i' };
    if (facility) query.facilities = { $in: [facility] };
    if (minFee || maxFee) {
      query.fees = {};
      if (minFee) query.fees.$gte = Number(minFee);
      if (maxFee) query.fees.$lte = Number(maxFee);
    }

    let sortObj = { rating: -1 };
    if (sort === 'fees_asc')  sortObj = { fees: 1 };
    if (sort === 'fees_desc') sortObj = { fees: -1 };

    const gyms = await Gym.find(query).sort(sortObj).select('-reviews');
    res.json(gyms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/gyms/:id  — get one gym with full details and reviews
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) return res.status(404).json({ message: 'Gym not found.' });
    res.json(gym);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/gyms/:id/review  — add a review (must be logged in)
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, text } = req.body;
    if (!rating || !text)
      return res.status(400).json({ message: 'Rating and review text are required.' });

    const gym = await Gym.findById(req.params.id);
    if (!gym) return res.status(404).json({ message: 'Gym not found.' });

    const alreadyReviewed = gym.reviews.find(
      r => r.user?.toString() === req.user._id.toString()
    );
    if (alreadyReviewed)
      return res.status(400).json({ message: 'You already reviewed this gym.' });

    gym.reviews.push({ user: req.user._id, userName: req.user.name, rating: Number(rating), text });
    gym.updateRating();
    await gym.save();

    res.status(201).json({ message: 'Review added!', rating: gym.rating, reviewCount: gym.reviewCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
