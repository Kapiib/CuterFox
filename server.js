const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const connectDB = require('./db/dbConfig');
const getRoutes = require('./routes/getRoutes');
const voteRoutes = require('./routes/voteRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', getRoutes);
app.use('/api/vote', voteRoutes); // Add this line

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});