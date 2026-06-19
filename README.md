# ATOMIC ÉLOI

Battle Pass des bonnes habitudes — tracker d'habitudes gamifié thème Fortnite pour Éloi.

## Configuration Firebase

1. Crée un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Active **Authentication** (Google + Email/Password)
3. Active **Firestore Database** (mode production, règles : authentification requise)
4. Copie `.env.example` → `.env` et remplis les valeurs :

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Règles Firestore recommandées

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Lancer en développement

```bash
npm install
npm run dev
```

## Déployer sur Vercel

```bash
npm install -g vercel
vercel
```

Ajoute les variables d'environnement dans le dashboard Vercel (Settings → Environment Variables).

## Architecture

- `src/hooks/useDaily.js` — logique principale : défis quotidiens, streak, Firestore
- `src/hooks/useXP.js` — système Battle Pass (Bronze → Champion)
- `src/data/challenges.js` — 20 défis + 1 boss thème Fortnite
- `src/utils/randomizer.js` — sélection quotidienne déterministe (seed = date)
- Firestore path : `users/{uid}/data/daily`
