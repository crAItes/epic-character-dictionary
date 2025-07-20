# Epic Character Dictionary Backend

## Overview
Epic Character Dictionary is a Web app designed first for writers and artists to organize their most valuable creative works in their crafts, being their fictional characters.  

## Getting Started

```bash
npm install -g firebase-tools
cd functions
npm install
firebase deploy --only functions
```

## 🧪 How to Test the Backend API (Phase 1)

After deploying the backend to Firebase, follow these steps to test the API using Postman.

### 1. Get a Firebase ID Token

1. Create a test user in Firebase under **Authentication > Users**.
2. Use the provided `token.html` utility (or Firebase Auth client SDK) to log in with that user.
3. Once logged in, extract the `idToken` from the page or browser console.

Use the token as a Bearer token in your Postman request headers:

```
Authorization: Bearer <your_id_token>
Content-Type: application/json
```

---

### 2. Test API Endpoints

**Base URL:**

```
https://us-central1-epiccharacterdictionary.cloudfunctions.net/api
```

**Available Routes:**

| Method | Endpoint                         | Description                               |
|--------|----------------------------------|-------------------------------------------|
| POST   | `/auth/register`                 | Register a new Firebase user              |
| POST   | `/dictionaries`                  | Create a new story dictionary             |
| GET    | `/dictionaries`                  | Fetch all user-created dictionaries       |
| POST   | `/characters/:dictionaryId`      | Add a character to a specific dictionary  |
| GET    | `/characters/:dictionaryId`      | List characters under a specific dictionary |

Make sure you’ve deployed your Firestore security rules and that your `idToken` matches the authenticated Firebase user.

If requests return `403 Forbidden`, double-check your Firestore rules and ensure your authenticated user's UID matches the Firestore document paths.

You can use **Postman** or **Insomnia** to send requests with your `idToken`. Ensure Firestore rules are deployed correctly.
