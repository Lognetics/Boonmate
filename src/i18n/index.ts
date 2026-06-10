import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import hi from './locales/hi.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import sw from './locales/sw.json';
import yo from './locales/yo.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'zh', label: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'it', label: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', label: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'yo', label: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
];

const STORAGE_KEY = 'boonmate.lang';

export async function initI18n() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const device = Localization.getLocales()[0]?.languageCode ?? 'en';
  const supported = SUPPORTED_LANGUAGES.map((l) => l.code);
  const initial = stored || (supported.includes(device) ? device : 'en');

  await i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: initial,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
      zh: { translation: zh },
      es: { translation: es },
      pt: { translation: pt },
      hi: { translation: hi },
      de: { translation: de },
      ja: { translation: ja },
      ko: { translation: ko },
      it: { translation: it },
      ru: { translation: ru },
      tr: { translation: tr },
      sw: { translation: sw },
      yo: { translation: yo },
    },
  });

  applyDirection(initial);
}

export async function changeLanguage(code: string) {
  await i18n.changeLanguage(code);
  await AsyncStorage.setItem(STORAGE_KEY, code);
  applyDirection(code);
}

function applyDirection(code: string) {
  const isRTL = SUPPORTED_LANGUAGES.find((l) => l.code === code)?.rtl ?? false;
  if (I18nManager.isRTL !== isRTL) {
    try {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    } catch {}
  }
}

export default i18n;
