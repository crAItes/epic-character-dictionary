const express = require('express');
const auth = require('../middleware/auth');
const { db } = require('../utils/firebaseAdmin');

const router = express.Router();

// Get user's dictionaries
router.get('/', auth, async (req, res) => {
  try {
    const snapshot = await db
      .collection('users')
      .doc(req.user.uid)
      .collection('dictionaries')
      .get();

    const dictionaries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(dictionaries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dictionaries' });
  }
});

// Create new dictionary
router.post('/', auth, async (req, res) => {
  const { title, description, genre, tags } = req.body;

  try {
    const ref = await db
      .collection('users')
      .doc(req.user.uid)
      .collection('dictionaries')
      .add({
        title,
        description,
        genre,
        tags,
        maxCharacters: req.user.role === 'ultra' ? 300 : req.user.role === 'pro' ? 50 : 20,
        characterCount: 0,
        createdAt: new Date().toISOString()
      });

    res.status(201).json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create dictionary' });
  }
});

module.exports = router;
