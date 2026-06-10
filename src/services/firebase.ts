import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  // @ts-ignore - exported by firebase/auth/react-native bundle
  getReactNativePersistence,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  User as FbUser,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function firebaseEnabled(): boolean {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
}

export function app(): FirebaseApp {
  if (!_app) {
    _app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return _app;
}

export function auth(): Auth {
  if (!_auth) {
    try {
      if (Platform.OS === 'web') {
        _auth = getAuth(app());
      } else {
        _auth = initializeAuth(app(), {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      }
    } catch {
      _auth = getAuth(app());
    }
  }
  return _auth;
}

export function db(): Firestore {
  if (!_db) _db = getFirestore(app());
  return _db;
}

export function storage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(app());
  return _storage;
}

export type { FbUser };

export async function signInEmail(email: string, password: string) {
  const c = await signInWithEmailAndPassword(auth(), email.trim(), password);
  return c.user;
}

export async function signUpEmail(email: string, password: string, displayName?: string) {
  const c = await createUserWithEmailAndPassword(auth(), email.trim(), password);
  if (displayName) await fbUpdateProfile(c.user, { displayName });
  return c.user;
}

export async function signOutUser() {
  await signOut(auth());
}

export function subscribeAuth(cb: (u: FbUser | null) => void) {
  return onAuthStateChanged(auth(), cb);
}

export async function uploadImageToStorage(uri: string, path: string): Promise<string> {
  const res = await fetch(uri);
  const blob = await res.blob();
  const r = ref(storage(), path);
  await uploadBytes(r, blob);
  return getDownloadURL(r);
}
