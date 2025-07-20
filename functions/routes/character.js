const express = require('express');
const auth = require('../middleware/auth');
const { db } = require('../utils/firebaseAdmin');

const router = express.Router();

router.post('/:dictionaryId', auth, async (req, res) => {
  const { dictionaryId } = req.params;
  const character = req.body;

  try {
    const dictRef = db.collection('users').doc(req.user.uid).collection('dictionaries').doc(dictionaryId);
    const dictDoc = await dictRef.get();

    if (!dictDoc.exists) return res.status(404).json({ error: 'Dictionary not found' });

    const { maxCharacters, characterCount } = dictDoc.data();
    if (characterCount >= maxCharacters) return res.status(403).json({ error: 'Character limit reached' });

    await dictRef.collection('characters').add({
      ...character,
      createdAt: new Date().toISOString()
    });

    await dictRef.update({ characterCount: characterCount + 1 });

    res.status(201).json({ message: 'Character added' });
  } catch (err) {
    console.error('Add Character error:', err);
    res.status(500).json({ error: 'Failed to add character' });
  }
});


router.get('/:dictionaryId', auth, async (req, res) => {
  const { dictionaryId } = req.params;

  try {
    const snapshot = await db
      .collection('users')
      .doc(req.user.uid)
      .collection('dictionaries')
      .doc(dictionaryId)
      .collection('characters')
      .get();

    const characters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(characters);
  } catch (err) {
    console.error('Fetch Characters Error:', err);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

module.exports = router;
