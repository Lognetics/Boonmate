import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Plan } from '@/utils/types';

interface SubState {
  plan: Plan;
  anonymous: boolean;
  hydrate: () => Promise<void>;
  setPlan: (p: Plan) => void;
  setAnonymous: (v: boolean) => void;
  isFeatureAllowed: (feature: 'voice' | 'unlimited_messages' | 'premium_circles' | 'anonymous' | 'advanced_ai') => boolean;
}

const KEY_PLAN = 'boonmate.plan';
const KEY_ANON = 'boonmate.anon';

const FEATURE_MIN_PLAN: Record<string, Plan[]> = {
  voice: ['plus', 'pro'],
  unlimited_messages: ['plus', 'pro'],
  premium_circles: ['plus', 'pro'],
  anonymous: ['pro'],
  advanced_ai: ['pro'],
};

export const useSubscriptionStore = create<SubState>((set, get) => ({
  plan: 'pro',
  anonymous: false,
  async hydrate() {
    const p = (await AsyncStorage.getItem(KEY_PLAN)) as Plan | null;
    const a = await AsyncStorage.getItem(KEY_ANON);
    set({ plan: p ?? 'pro', anonymous: a === '1' });
  },
  setPlan(p) {
    AsyncStorage.setItem(KEY_PLAN, p);
    set({ plan: p });
  },
  setAnonymous(v) {
    AsyncStorage.setItem(KEY_ANON, v ? '1' : '0');
    set({ anonymous: v });
  },
  isFeatureAllowed(feature) {
    const allowed = FEATURE_MIN_PLAN[feature];
    return !!allowed && allowed.includes(get().plan);
  },
}));
