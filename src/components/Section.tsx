import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  title: string;
  caption?: string;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SectionHeader: React.FC<Props> = ({ title, caption, right, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, style]}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800', letterSpacing: -0.2 }}>{title}</Text>
        {caption ? <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{caption}</Text> : null}
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
});

export default SectionHeader;
