import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { AppTheme, ThemeName, themesByName } from './themes';

interface ThemeCtx {
  theme: AppTheme;
  themeName: ThemeName;
  isDark: boolean;
  toggle: () => void;
  setTheme: (n: ThemeName) => void;
  lowStimulation: boolean;
  setLowStimulation: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = 'boonmate.theme';
const LOW_STIM_KEY = 'boonmate.lowStimulation';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = Appearance.getColorScheme();
  const [themeName, setThemeName] = useState<ThemeName>(system === 'light' ? 'light' : 'dark');
  const [lowStimulation, setLowStimRaw] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') setThemeName(stored);
      const ls = await AsyncStorage.getItem(LOW_STIM_KEY);
      if (ls === '1') setLowStimRaw(true);
    })();
  }, []);

  const setTheme = useCallback((n: ThemeName) => {
    setThemeName(n);
    AsyncStorage.setItem(STORAGE_KEY, n);
  }, []);

  const toggle = useCallback(() => setTheme(themeName === 'dark' ? 'light' : 'dark'), [themeName, setTheme]);

  const setLowStimulation = useCallback((v: boolean) => {
    setLowStimRaw(v);
    AsyncStorage.setItem(LOW_STIM_KEY, v ? '1' : '0');
  }, []);

  const value = useMemo<ThemeCtx>(
    () => ({
      theme: themesByName[themeName],
      themeName,
      isDark: themeName === 'dark',
      toggle,
      setTheme,
      lowStimulation,
      setLowStimulation,
    }),
    [themeName, toggle, setTheme, lowStimulation, setLowStimulation],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
