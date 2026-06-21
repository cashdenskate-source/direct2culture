# Direct2Culture

Culture media platform — discovery + lead capture engine.
Built with React + Vite + Tailwind, deployed to Firebase Hosting on the `direct2culture` Firebase project.

## Quick start

```bash
npm install
cp .env.example .env.local   # then paste real Firebase web config values
npm run dev
```

Open http://localhost:5173.

## Firebase setup

This project is already pointed at the Firebase project **`direct2culture`** via `.firebaserc`.

1. Get your Firebase Web App config from:
   Firebase Console → `direct2culture` → Project Settings → General → Your apps → Web app.
2. Paste the values into `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=direct2culture.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=direct2culture
   VITE_FIREBASE_STORAGE_BUCKET=direct2culture.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. Enable Firestore in the Firebase Console (Native mode).
4. Push the security rules:
   ```bash
   npx firebase deploy --only firestore:rules
   ```

Until env vars are set, all form submissions are stored to `localStorage` so the UI still works locally.

## Deploy

```bash
npm run build
npx firebase deploy --only hosting
```

This builds `dist/` and pushes to Firebase Hosting on the `direct2culture` project.
Connect the custom domain `direct2culture.com` in the Firebase Console under Hosting → Add custom domain.

## Firestore collections

Form submissions land in three collections:

- `newsletter` — `{ email, source, createdAt }`
- `brand_submissions` — full submit form payload
- `contact_messages` — `{ name, email, subject, message, createdAt }`

Rules are write-only from the client; read access is admin-only via the Firebase Console.

## Editing content

All placeholder content lives in `src/data/content.js`:

- `cultureSignals`, `interviews`, `drops`, `events`, `brandsToWatch`, `creatorsToWatch`

Swap the placeholder image blocks (`ImagePlaceholder`) for real `<img>` tags once you have shoot assets.

## Tech

- React 18 + React Router 6
- Vite 5
- Tailwind CSS 3
- Firebase 10 (Firestore + Hosting)
- react-helmet-async (per-page SEO)
