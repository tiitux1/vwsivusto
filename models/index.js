import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/volkswagen-finder'

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (global.mongoose.conn) {
    return global.mongoose.conn
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    }

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  global.mongoose.conn = await global.mongoose.promise
  return global.mongoose.conn
}

// Car Schema
const CarSchema = new mongoose.Schema({
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
  averageRating: { type: String },
  reviewCount: { type: Number, default: 0 }
})

// Review Schema
const ReviewSchema = new mongoose.Schema({
  carId: { type: Number, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

// User Preferences Schema
const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  favorites: [{ type: Number }],
  compare: [{ type: Number }]
})

// Models
export const Car = mongoose.models.Car || mongoose.model('Car', CarSchema)
export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
export const UserPreferences = mongoose.models.UserPreferences || mongoose.model('UserPreferences', UserPreferencesSchema)

export default connectToDatabase
