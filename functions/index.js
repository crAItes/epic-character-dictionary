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
app.use('/api/auth', authRoutes);
app.use('/api/dictionaries', dictionaryRoutes);
app.use('/api/characters', characterRoutes);

// Deployable function
exports.api = functions.https.onRequest(app);
