export type ThemeName = 'light' | 'dark';

export interface AppTheme {
  background: string;
  surface: string;
  card: string;
  cardElevated: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  primary: string;
  primarySoft: string;
  primaryGradient: [string, string, ...string[]];
  accent: string;
  success: string;
  warning: string;
  danger: string;
  chipBg: string;
  chipText: string;
  overlay: string;
  shimmer: string;
}

export const lightTheme: AppTheme = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  border: '#F4D6E6',
  primary: '#EC4899',
  primarySoft: '#FCE7F3',
  primaryGradient: ['#F472B6', '#EC4899', '#A855F7'],
  accent: '#A855F7',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  chipBg: '#F3F4F6',
  chipText: '#0F172A',
  overlay: 'rgba(0,0,0,0.45)',
  shimmer: '#F1F5F9',
};

export const darkTheme: AppTheme = {
  background: '#0B0B0F',
  surface: '#15131C',
  card: '#1A1822',
  cardElevated: '#221F2C',
  text: '#F8FAFC',
  textMuted: '#9CA3AF',
  textInverse: '#0F172A',
  border: '#3A2330',
  primary: '#EC4899',
  primarySoft: '#3C1A2C',
  primaryGradient: ['#F472B6', '#EC4899', '#A855F7'],
  accent: '#C084FC',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  chipBg: '#26232F',
  chipText: '#F8FAFC',
  overlay: 'rgba(0,0,0,0.6)',
  shimmer: '#1F1C2A',
};

export const themesByName: Record<ThemeName, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
