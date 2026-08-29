const mongoose = require('mongoose');

// Each review inside a gym
const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  text:     { type: String, required: true }
}, { timestamps: true });

// This defines what a Gym looks like in the database
const gymSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  location:    { type: String, required: true },
  city:        { type: String, required: true, lowercase: true },
  pincode:     { type: String },
  phone:       { type: String },
  description: { type: String },
  fees:        { type: Number, required: true },   // monthly fee in rupees
  timings:     { type: String, default: '6:00 AM – 10:00 PM' },
  facilities:  [{ type: String }],
  icon:        { type: String, default: '🏋️' },
  badge:       { type: String },
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews:     [reviewSchema],
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

// Recalculate average rating whenever a review is added
gymSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.reviewCount = 0; return; }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating      = Math.round((total / this.reviews.length) * 10) / 10;
  this.reviewCount = this.reviews.length;
};

module.exports = mongoose.model('Gym', gymSchema);
