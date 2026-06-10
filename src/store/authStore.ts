import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { me as defaultMe } from '@/services/mockData';
import type { User } from '@/utils/types';
import { firebaseEnabled, signInEmail, signUpEmail, signOutUser, subscribeAuth } from '@/services/firebase';
import { getUserDoc, upsertUser } from '@/services/firestore';

interface OnboardingDraft {
  name?: string;
  bio?: string;
  personality?: string;
  lifeStage?: string;
  interests: string[];
  intent?: 'friends' | 'network' | 'explore';
  lookingFor: string[];
  availability: string[];
  chosenCircles: string[];
  notifications?: boolean;
  language?: string;
}

interface AuthState {
  status: 'onboarding' | 'authed';
  user: User;
  draft: OnboardingDraft;
  authError?: string;

  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  finishOnboarding: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  setDraft: (patch: Partial<OnboardingDraft>) => void;
  toggleDraft: (key: 'interests' | 'lookingFor' | 'availability' | 'chosenCircles', value: string) => void;
}

const STATE_KEY = 'boonmate.authState';
const PROFILE_KEY = 'boonmate.profile';

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'onboarding',
  user: defaultMe,
  draft: { interests: [], lookingFor: [], availability: [], chosenCircles: [] },

  async hydrate() {
    const stored = await AsyncStorage.getItem(STATE_KEY);
    const profile = await AsyncStorage.getItem(PROFILE_KEY);
    set({
      status: stored === 'authed' ? 'authed' : 'onboarding',
      user: profile ? { ...defaultMe, ...JSON.parse(profile) } : defaultMe,
    });

    if (firebaseEnabled()) {
      subscribeAuth(async (fb) => {
        if (fb) {
          const remote = await getUserDoc(fb.uid);
          const merged: User = remote
            ? remote
            : {
                ...defaultMe,
                id: fb.uid,
                name: fb.displayName ?? get().user.name ?? 'Boonmate user',
              };
          await AsyncStorage.setItem(STATE_KEY, 'authed');
          await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
          set({ status: 'authed', user: merged, authError: undefined });
        } else if (stored === 'authed') {
          // Firebase says no session — clear local
          await AsyncStorage.removeItem(STATE_KEY);
          set({ status: 'onboarding' });
        }
      });
    }
  },

  async signIn(email, password) {
    set({ authError: undefined });
    try {
      if (firebaseEnabled()) {
        await signInEmail(email, password);
        // hydrate via subscribeAuth listener
      } else {
        await AsyncStorage.setItem(STATE_KEY, 'authed');
        set({ status: 'authed' });
      }
    } catch (e: any) {
      set({ authError: prettyAuthError(e) });
      throw e;
    }
  },

  async signUp(email, password) {
    set({ authError: undefined });
    try {
      if (firebaseEnabled()) {
        const fbUser = await signUpEmail(email, password, get().draft.name);
        const u: User = {
          ...defaultMe,
          id: fbUser.uid,
          name: get().draft.name || 'Boonmate user',
          bio: get().draft.bio || '',
          interests: get().draft.interests,
          circles: get().draft.chosenCircles,
          language: get().draft.language,
        };
        await upsertUser(fbUser.uid, u);
        await AsyncStorage.setItem(STATE_KEY, 'authed');
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(u));
        set({ status: 'authed', user: u });
      } else {
        await AsyncStorage.setItem(STATE_KEY, 'authed');
        set({ status: 'authed' });
      }
    } catch (e: any) {
      set({ authError: prettyAuthError(e) });
      throw e;
    }
  },

  async finishOnboarding() {
    const { draft, user } = get();
    const next: User = {
      ...user,
      name: draft.name || user.name,
      bio: draft.bio || user.bio,
      interests: draft.interests.length ? draft.interests : user.interests,
      circles: draft.chosenCircles.length ? draft.chosenCircles : user.circles,
      language: draft.language ?? user.language,
    };
    await AsyncStorage.setItem(STATE_KEY, 'authed');
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    if (firebaseEnabled() && next.id && next.id !== 'me') {
      await upsertUser(next.id, next);
    }
    set({ status: 'authed', user: next });
  },

  async signOut() {
    if (firebaseEnabled()) await signOutUser();
    await AsyncStorage.removeItem(STATE_KEY);
    set({ status: 'onboarding' });
  },

  async updateProfile(patch) {
    const user = { ...get().user, ...patch };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user));
    if (firebaseEnabled() && user.id && user.id !== 'me') {
      await upsertUser(user.id, user);
    }
    set({ user });
  },

  setDraft(patch) {
    set({ draft: { ...get().draft, ...patch } });
  },
  toggleDraft(key, value) {
    const cur = get().draft[key];
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    set({ draft: { ...get().draft, [key]: next } });
  },
}));

function prettyAuthError(e: any): string {
  const code = e?.code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'That email is already in use. Try logging in.';
    case 'auth/weak-password':
      return 'Password is too weak — pick at least 6 characters.';
    case 'auth/invalid-email':
      return 'That email looks malformed.';
    case 'auth/network-request-failed':
      return 'Network error — check your connection.';
    default:
      return e?.message ?? 'Something went wrong. Please try again.';
  }
}
