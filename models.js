const mongoose = require('mongoose');

// Car Schema
const carSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  engine: { type: String, required: true },
  horsepower: { type: Number, required: true },
  transmission: { type: String, required: true },
  fuel: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  carId: { type: Number, required: true, ref: 'Car' },
  userId: { type: String, default: 'anonymous' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// User Preferences Schema (for favorites and compare)
const userPreferencesSchema = new mongoose.Schema({
  userId: { type: String, default: 'default' }, // For future multi-user support
  favorites: [{ type: Number, ref: 'Car' }], // Array of car IDs
  compare: [{ type: Number, ref: 'Car' }] // Array of car IDs
}, {
  timestamps: true
});

// Create models
const Car = mongoose.model('Car', carSchema);
const Review = mongoose.model('Review', reviewSchema);
const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

module.exports = { Car, Review, UserPreferences };
