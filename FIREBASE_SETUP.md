# Firebase Setup — Step by Step

The app now ships with **real** Firebase Auth, Firestore, and Storage wiring. Without keys it runs in mock mode automatically. Here's the full set-up.

---

## 1. In the Firebase Console (3 minutes)

You created project **`boonmate`** already. From its dashboard:

### 1a. Register a Web app and copy the config
- ⚙️ (gear icon, top left) → **Project settings**
- Scroll to **Your apps** → if there's no Web app yet, click **`</>`** → nickname `Boonmate` → **Register app**
- Under **SDK setup and configuration**, choose **Config** — copy the block:
```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "boonmate-xxxx.firebaseapp.com",
  projectId: "boonmate-xxxx",
  storageBucket: "boonmate-xxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 1b. Enable Email/Password auth
- Left sidebar → **Build → Authentication → Get started**
- **Sign-in method** tab → **Email/Password** → **Enable** → **Save**

### 1c. Create Firestore in test mode
- Left sidebar → **Build → Firestore Database → Create database**
- Pick a region (e.g. `us-central1`) → **Start in test mode** → **Create**

### 1d. Create Storage
- Left sidebar → **Build → Storage → Get started → Start in test mode → Next → Done**

---

## 2. Drop keys into the project (1 minute)

Create a file named `.env` in the project root (next to `package.json`). Fill it in with the values from step 1a:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=boonmate-xxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=boonmate-xxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=boonmate-xxxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 3. Install + run

```bash
npm install
npx expo start -c
```
The `-c` flag clears Metro's cache so the new env vars get picked up.

---

## 4. Verify it works

1. **Open Settings (Me tab → ⚙️) and scroll to the bottom.** You should see "**Firebase status: ● Connected**". If it says **Mock mode**, the env vars aren't loaded — re-run `npx expo start -c`.
2. **Sign up.** Go through onboarding → finish at "Enable notifications" → it now actually creates a Firebase user. Check the Firebase console → **Authentication → Users** — your account is there.
3. **Tap "Seed demo data to Firestore"** in Settings. This pushes all 11 demo users, 24 circles, and 14 posts into your Firestore. Check **Firestore → Data** to see them.
4. **Post something.** Use the Home tab composer. The post is written to Firestore in real time. Open a second device/simulator with the same account — it appears instantly.
5. **Send a chat message.** Open any chat from the Chat tab — messages now stream from Firestore via `onSnapshot`.

---

## 5. Production rules (replace test mode before launch)

The repo ships with `firestore.rules` and `storage.rules` that lock everything down properly. To deploy them:

```bash
npm i -g firebase-tools
firebase login
firebase use boonmate-xxxx        # your project ID
firebase deploy --only firestore:rules,storage:rules
```

Then in the Firebase console → **Firestore Database → Rules** you'll see them live.

---

## What's actually wired

| Feature | Backend |
|---|---|
| Sign up / sign in / sign out | Firebase Auth |
| User profile + edit | `users/{uid}` doc |
| Avatar upload | Storage `avatars/{uid}/avatar.jpg` |
| Posts feed (real-time) | `posts` collection with `onSnapshot` |
| Like a post | `posts/{id}` — atomic `increment` + `arrayUnion` |
| Create post + image | `posts` doc + Storage `posts/{uid}/{ts}.jpg` |
| Delete own post | `posts/{id}` delete |
| Circles list + members | `circles/{id}` |
| Join circle | `circles/{id}` — `memberIds` `arrayUnion` |
| Chat list (real-time) | `chats` filtered by `participantIds` |
| Chat messages (real-time) | `chats/{id}/messages` sub-collection |
| Send message | `chats/{id}/messages` doc + chat preview update |
| Seed demo data | One-tap from Settings → Developer |

Events, notifications, therapists, surrogacy institutions, growth content, and Boon AI are still local — they're either reference data or session state.

---

## Files added/modified for the wiring

- `src/services/firebase.ts` — Auth (with AsyncStorage persistence on RN), Firestore, Storage exports
- `src/services/firestore.ts` — typed CRUD + real-time subscriptions
- `src/services/seed.ts` — one-tap demo data seeder
- `src/store/authStore.ts` — `signIn`, `signUp`, `signOut`, hydrates from Firestore on auth state change
- `src/store/socialStore.ts` — `attachRemote()` wires posts + circles + chats subscriptions
- `App.tsx` — calls `attachRemote()` after auth
- `src/screens/onboarding/LoginScreen.tsx`, `SignUpScreen.tsx`, `NotificationsOptInScreen.tsx` — real auth flow
- `src/screens/profile/SettingsScreen.tsx` — Firebase status + Seed button
- `src/screens/profile/EditProfileScreen.tsx`, `src/screens/home/CreatePostScreen.tsx` — Storage uploads
- `src/screens/chat/ChatRoomScreen.tsx` — subscribes to live messages
- `firestore.rules`, `storage.rules`, `firebase.json` — security + deploy config

---

## Troubleshooting

- **`auth/operation-not-allowed`** → you skipped step 1b. Enable Email/Password.
- **`permission-denied` on Firestore reads** → test mode expired (30 days), or you deployed prod rules before signing in. Re-enable test mode temporarily or deploy `firestore.rules` so they let signed-in users read.
- **App says "Mock mode" even after adding `.env`** → make sure `.env` is in the project root (same folder as `package.json`), not inside `src/`. Then restart with `npx expo start -c`.
- **Image uploads fail with `storage/unauthorized`** → deploy `storage.rules` or temporarily set Storage to test mode.
- **`@firebase/auth: Auth (...) You are initializing Firebase Auth for React Native without providing AsyncStorage`** — you're on Expo Go; this is a warning and works fine in mock mode. Once `.env` is set, the code uses `getReactNativePersistence(AsyncStorage)` and the warning goes away.
