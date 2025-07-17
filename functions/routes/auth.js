const express = require('express');
const { db } = require('../utils/firebaseAdmin');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { uid, email, displayName } = req.body;

  try {
    await db.collection('users').doc(uid).set({
      email,
      displayName,
      role: 'free',
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'User registered' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

module.exports = router;
