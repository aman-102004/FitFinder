const mongoose = require('mongoose');

// One tracker document per user — stores all their fitness data
const trackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // one tracker per user
  },

  // Body measurements
  profile: {
    weight:      { type: Number },   // kg
    height:      { type: Number },   // cm
    age:         { type: Number },
    gender:      { type: String, enum: ['male', 'female', 'other'] },
    goal:        { type: String },   // weight_loss / muscle_gain / maintenance
    activityLevel: { type: String },
    targetWeight:  { type: Number },
  },

  // Daily workout logs — each entry = one workout session
  workoutLogs: [{
    date:        { type: Date, default: Date.now },
    name:        { type: String, required: true },   // e.g. "Chest Day"
    exercises: [{
      name:      { type: String },   // e.g. "Bench Press"
      sets:      { type: Number },
      reps:      { type: Number },
      weight:    { type: Number },   // kg used
    }],
    duration:    { type: Number },   // minutes
    notes:       { type: String },
  }],

  // Daily diet logs
  dietLogs: [{
    date:        { type: Date, default: Date.now },
    meal:        { type: String },   // Breakfast / Lunch / Dinner / Snack
    food:        { type: String },
    calories:    { type: Number },
    protein:     { type: Number },   // grams
    carbs:       { type: Number },   // grams
    fat:         { type: Number },   // grams
  }],

  // Weight tracked over time
  weightHistory: [{
    date:        { type: Date, default: Date.now },
    weight:      { type: Number, required: true },
  }],

  // User-set goals and targets
  goals: {
    dailyCalories:   { type: Number },
    dailyProtein:    { type: Number },
    weeklyWorkouts:  { type: Number, default: 4 },
    targetWeight:    { type: Number },
    targetDate:      { type: Date },
  },

  // Step counter
  stepLogs: [{
    date:   { type: Date, default: Date.now },
    steps:  { type: Number },
  }],

}, { timestamps: true });

module.exports = mongoose.model('Tracker', trackerSchema);
