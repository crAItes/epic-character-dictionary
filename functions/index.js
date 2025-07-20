const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dictionaryRoutes = require('./routes/dictionary');
const characterRoutes = require('./routes/character');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/dictionaries', dictionaryRoutes);
app.use('/characters', characterRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Epic Character Dictionary API!');
});

// Deployable function
exports.api = functions.https.onRequest(app);
