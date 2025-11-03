const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { Car, Review, UserPreferences } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/volkswagen-finder';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize database with car data
async function initializeDatabase() {
  try {
    const count = await Car.countDocuments();
    if (count === 0) {
      console.log('Initializing database with car data...');
      await Car.insertMany(cars);
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Car data (for initial database population)
const cars = [
  {
    id: 1,
    model: "Golf GTI",
    year: 2023,
    price: 38990,
    engine: "2.0L Turbo",
    horsepower: 245,
    transmission: "Automatic DSG",
    fuel: "Petrol",
    image: "images/golf-gti.jpg",
    description: "Iconic sporty hatchback combining performance and style."
  },
  {
    id: 2,
    model: "Passat",
    year: 2023,
    price: 32990,
    engine: "1.5L Turbo",
    horsepower: 150,
    transmission: "Manual",
    fuel: "Petrol",
    image: "images/passat-lol.jpg",
    description: "Comfortable family sedan with modern features."
  },
  {
    id: 3,
    model: "ID.4",
    year: 2023,
    price: 45990,
    engine: "Electric Motor",
    horsepower: 201,
    transmission: "Automatic",
    fuel: "Electric",
    image: "images/id4.jpg",
    description: "All-electric SUV with impressive range and tech."
  },
  {
    id: 4,
    model: "Polo",
    year: 2023,
    price: 19990,
    engine: "1.0L Turbo",
    horsepower: 95,
    transmission: "Manual",
    fuel: "Petrol",
    image: "images/polo.jpg",
    description: "Compact and efficient city car."
  },
  {
    id: 5,
    model: "Tiguan",
    year: 2023,
    price: 35990,
    engine: "2.0L Diesel",
    horsepower: 150,
    transmission: "Automatic",
    fuel: "Diesel",
    image: "images/tiguan.jpg",
    description: "Versatile SUV for family adventures."
  },
  {
    id: 6,
    model: "Arteon",
    year: 2023,
    price: 41990,
    engine: "2.0L Turbo",
    horsepower: 190,
    transmission: "Automatic DSG",
    fuel: "Petrol",
    image: "images/arteon.jpg",
    description: "Elegant fastback with premium interior."
  },
  {
    id: 7,
    model: "Touareg",
    year: 2023,
    price: 69990,
    engine: "3.0L V6 Diesel",
    horsepower: 286,
    transmission: "Automatic",
    fuel: "Diesel",
    image: "images/touareg.jpg",
    description: "Luxury SUV with off-road capabilities and premium comfort."
  },
  {
    id: 8,
    model: "Golf R",
    year: 2023,
    price: 52990,
    engine: "2.0L Turbo",
    horsepower: 320,
    transmission: "Automatic DSG",
    fuel: "Petrol",
    image: "images/golf-r.jpg",
    description: "High-performance version of the Golf with all-wheel drive."
  },
  {
    id: 9,
    model: "ID.3",
    year: 2023,
    price: 39990,
    engine: "Electric Motor",
    horsepower: 204,
    transmission: "Automatic",
    fuel: "Electric",
    image: "images/id3.jpg",
    description: "Compact electric hatchback with modern design."
  },
  {
    id: 10,
    model: "T-Roc",
    year: 2023,
    price: 28990,
    engine: "1.5L Turbo",
    horsepower: 150,
    transmission: "Manual",
    fuel: "Petrol",
    image: "images/t-roc.jpg",
    description: "Stylish compact SUV with urban appeal."
  },
  {
    id: 11,
    model: "Sharan",
    year: 2023,
    price: 44990,
    engine: "2.0L Diesel",
    horsepower: 150,
    transmission: "Automatic DSG",
    fuel: "Diesel",
    image: "images/sharan.jpg",
    description: "Spacious family MPV with sliding doors."
  },
  {
    id: 12,
    model: "Caddy",
    year: 2023,
    price: 31990,
    engine: "2.0L Diesel",
    horsepower: 122,
    transmission: "Manual",
    fuel: "Diesel",
    image: "images/caddy.jpg",
    description: "Versatile commercial vehicle perfect for business use."
  },
  {
    id: 13,
    model: "Amarok",
    year: 2023,
    price: 49990,
    engine: "3.0L V6 Diesel",
    horsepower: 224,
    transmission: "Automatic",
    fuel: "Diesel",
    image: "images/amarok.jpg",
    description: "Robust pickup truck for work and adventure."
  },
  {
    id: 14,
    model: "Taos",
    year: 2023,
    price: 32990,
    engine: "1.5L Turbo",
    horsepower: 158,
    transmission: "Automatic",
    fuel: "Petrol",
    image: "images/taos.jpg",
    description: "Compact crossover SUV with modern features."
  },
  {
    id: 15,
    model: "Atlas",
    year: 2023,
    price: 41990,
    engine: "2.0L Turbo",
    horsepower: 235,
    transmission: "Automatic",
    fuel: "Petrol",
    image: "images/atlas.jpg",
    description: "Large family SUV with three rows of seating."
  }
];

// Helper function to read/write JSON files (fallback)
function readJsonFile(filename) {
  try {
    const data = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeJsonFile(filename, data) {
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ id: 1 });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    // Fallback to JSON file
    const cars = readJsonFile('cars.json');
    res.json(cars);
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    const prefs = await UserPreferences.findOne({ userId: 'default' });
    res.json(prefs ? prefs.favorites : []);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    // Fallback to JSON file
    const favorites = readJsonFile('favorites.json');
    res.json(favorites);
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { favorites } = req.body;
    await UserPreferences.findOneAndUpdate(
      { userId: 'default' },
      { favorites },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving favorites:', error);
    // Fallback to JSON file
    writeJsonFile('favorites.json', req.body.favorites);
    res.json({ success: true });
  }
});

app.get('/api/compare', async (req, res) => {
  try {
    const prefs = await UserPreferences.findOne({ userId: 'default' });
    res.json(prefs ? prefs.compare : []);
  } catch (error) {
    console.error('Error fetching compare:', error);
    // Fallback to JSON file
    const compare = readJsonFile('compare.json');
    res.json(compare);
  }
});

app.post('/api/compare', async (req, res) => {
  try {
    const { compare } = req.body;
    await UserPreferences.findOneAndUpdate(
      { userId: 'default' },
      { compare },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving compare:', error);
    // Fallback to JSON file
    writeJsonFile('compare.json', req.body.compare);
    res.json({ success: true });
  }
});

// Review routes
app.get('/api/reviews/:carId', async (req, res) => {
  try {
    const { carId } = req.params;
    const reviews = await Review.find({ carId: parseInt(carId) }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { carId, rating, comment, userId } = req.body;
    const review = new Review({
      carId: parseInt(carId),
      rating: parseInt(rating),
      comment,
      userId: userId || 'anonymous'
    });
    await review.save();

    // Update car's average rating and review count
    const allReviews = await Review.find({ carId: parseInt(carId) });
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const reviewCount = allReviews.length;

    await Car.findOneAndUpdate(
      { id: parseInt(carId) },
      { averageRating: averageRating.toFixed(1), reviewCount }
    );

    res.json({ success: true, review });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeDatabase();
});
