import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'muted';
}

const Chip: React.FC<Props> = ({ label, selected, onPress, leading, trailing, size = 'md', style, tone = 'default' }) => {
  const { theme } = useTheme();
  const padV = size === 'sm' ? 5 : 7;
  const padH = size === 'sm' ? 10 : 12;
  const fontSize = size === 'sm' ? 11 : 12;

  const content = (
    <View style={[styles.row, { paddingVertical: padV, paddingHorizontal: padH }]}>
      {leading ? <View style={{ marginRight: 6 }}>{leading}</View> : null}
      <Text
        style={{
          color: selected ? '#fff' : tone === 'muted' ? theme.textMuted : theme.chipText,
          fontWeight: '600',
          fontSize,
        }}
      >
        {label}
      </Text>
      {trailing ? <View style={{ marginLeft: 6 }}>{trailing}</View> : null}
    </View>
  );

  if (selected) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.wrap, style]}>
        <LinearGradient colors={theme.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.wrap}>
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.wrap, { backgroundColor: theme.chipBg, borderColor: theme.border, borderWidth: 1 }, style]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: { borderRadius: 999, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default Chip;
