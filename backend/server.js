const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();

// ✅ Allow frontend URLs (local + deployed Netlify)
const allowedOrigins = [
  'http://localhost:3000',
  'https://moonlit-heliotrope-e23ca5.netlify.app',
  'https://quiet-dolphin-5abdc0.netlify.app/'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/api/users', userRoutes);

// ✅ PORT logic to support Render deployment
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error('MongoDB connection error:', err));
