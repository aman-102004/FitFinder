const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// This defines what a User looks like in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false  // don't return password in queries
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness'],
    default: 'general_fitness'
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gym' }]
}, { timestamps: true });

// Automatically hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if a password is correct at login
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
