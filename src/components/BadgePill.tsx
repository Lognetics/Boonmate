import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export type BadgeKind = 'Connector' | 'Explorer' | 'Creative' | 'Pioneer' | 'Healer' | 'Supporter' | 'Smart';

const ICONS: Record<BadgeKind, string> = {
  Connector: '🤝',
  Explorer: '🧭',
  Creative: '🎨',
  Pioneer: '🚀',
  Healer: '💜',
  Supporter: '🌟',
  Smart: '✨',
};

const COLORS: Record<BadgeKind, { bg: string; text: string }> = {
  Connector: { bg: '#3C1A2C', text: '#F472B6' },
  Explorer: { bg: '#1E2A4A', text: '#60A5FA' },
  Creative: { bg: '#3B1E4A', text: '#C084FC' },
  Pioneer: { bg: '#4A2A1E', text: '#FB923C' },
  Healer: { bg: '#2A1E4A', text: '#A78BFA' },
  Supporter: { bg: '#1E4A3B', text: '#34D399' },
  Smart: { bg: '#3C1A2C', text: '#EC4899' },
};

interface Props {
  kind: BadgeKind;
  compact?: boolean;
}

const BadgePill: React.FC<Props> = ({ kind, compact }) => {
  const { isDark } = useTheme();
  const palette = COLORS[kind];
  const bg = isDark ? palette.bg : palette.text + '22';
  return (
    <View style={[styles.wrap, { backgroundColor: bg, paddingVertical: compact ? 2 : 4, paddingHorizontal: compact ? 8 : 10 }]}>
      <Text style={{ fontSize: compact ? 10 : 11, color: palette.text, fontWeight: '700' }}>
        {ICONS[kind]} {kind}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { borderRadius: 999, alignSelf: 'flex-start' },
});

export default BadgePill;
