const { admin } = require('../utils/firebaseAdmin');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();
    req.user.role = userDoc.exists ? userDoc.data().role : 'free';

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(403).json({ error: 'Forbidden' });
  }
};
