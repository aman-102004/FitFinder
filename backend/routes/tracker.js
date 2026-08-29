const express = require('express');
const Tracker  = require('../models/Tracker');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes need the user to be logged in
router.use(protect);

// ── GET tracker (or create one if first time) ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    let tracker = await Tracker.findOne({ user: req.user._id });
    if (!tracker) {
      // First time — create an empty tracker for this user
      tracker = await Tracker.create({
        user: req.user._id,
        profile: {
          goal:   req.user.goal,
          weight: null,
          height: null,
        }
      });
    }
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── UPDATE profile (weight, height, goals etc.) ───────────────────────────
router.put('/profile', async (req, res) => {
  try {
    const tracker = await Tracker.findOneAndUpdate(
      { user: req.user._id },
      { $set: { profile: req.body.profile, goals: req.body.goals } },
      { new: true, upsert: true }
    );
    res.json({ message: 'Profile updated!', tracker });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── LOG A WORKOUT ─────────────────────────────────────────────────────────
router.post('/workout', async (req, res) => {
  try {
    const { name, exercises, duration, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'Workout name is required.' });

    const tracker = await Tracker.findOneAndUpdate(
      { user: req.user._id },
      { $push: { workoutLogs: { name, exercises: exercises || [], duration, notes, date: new Date() } } },
      { new: true, upsert: true }
    );
    res.status(201).json({ message: 'Workout logged!', workoutLogs: tracker.workoutLogs });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE a workout log ──────────────────────────────────────────────────
router.delete('/workout/:logId', async (req, res) => {
  try {
    await Tracker.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { workoutLogs: { _id: req.params.logId } } }
    );
    res.json({ message: 'Workout deleted.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── LOG FOOD / DIET ───────────────────────────────────────────────────────
router.post('/diet', async (req, res) => {
  try {
    const { meal, food, calories, protein, carbs, fat } = req.body;
    if (!food) return res.status(400).json({ message: 'Food name is required.' });

    const tracker = await Tracker.findOneAndUpdate(
      { user: req.user._id },
      { $push: { dietLogs: { meal, food, calories, protein, carbs, fat, date: new Date() } } },
      { new: true, upsert: true }
    );
    res.status(201).json({ message: 'Meal logged!', dietLogs: tracker.dietLogs });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE a diet log ─────────────────────────────────────────────────────
router.delete('/diet/:logId', async (req, res) => {
  try {
    await Tracker.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { dietLogs: { _id: req.params.logId } } }
    );
    res.json({ message: 'Meal deleted.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── LOG WEIGHT ────────────────────────────────────────────────────────────
router.post('/weight', async (req, res) => {
  try {
    const { weight } = req.body;
    if (!weight) return res.status(400).json({ message: 'Weight is required.' });

    const tracker = await Tracker.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: { weightHistory: { weight, date: new Date() } },
        $set:  { 'profile.weight': weight }
      },
      { new: true, upsert: true }
    );
    res.status(201).json({ message: 'Weight logged!', weightHistory: tracker.weightHistory });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── GET STATS (summary for dashboard) ────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const tracker = await Tracker.findOne({ user: req.user._id });
    if (!tracker) return res.json({ workoutsThisWeek: 0, caloriesToday: 0, proteinToday: 0 });

    // Workouts this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const workoutsThisWeek = tracker.workoutLogs.filter(w => new Date(w.date) >= weekAgo).length;

    // Calories and protein today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysMeals  = tracker.dietLogs.filter(d => new Date(d.date) >= today);
    const caloriesToday = todaysMeals.reduce((sum, d) => sum + (d.calories || 0), 0);
    const proteinToday  = todaysMeals.reduce((sum, d) => sum + (d.protein  || 0), 0);

    // Latest weight
    const latestWeight = tracker.weightHistory.length
      ? tracker.weightHistory[tracker.weightHistory.length - 1].weight
      : tracker.profile?.weight || null;

    res.json({
      workoutsThisWeek,
      caloriesToday,
      proteinToday,
      latestWeight,
      totalWorkouts: tracker.workoutLogs.length,
      goals: tracker.goals,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
