const fetch = require('node-fetch');

const run = async () => {
  const token = 'YOUR_FIREBASE_USER_ID_TOKEN_HERE';

  const res = await fetch('https://us-central1-epiccharacterdictionary.cloudfunctions.net/api/api/dictionaries', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  const json = await res.json();
  console.log('RESPONSE:', json);
};

run();
