import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  elevated?: boolean;
}

const Card: React.FC<Props> = ({ onPress, children, style, padding = 14, elevated }) => {
  const { theme, isDark } = useTheme();
  const baseStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: elevated ? theme.cardElevated : theme.card,
      borderRadius: 16,
      padding,
      borderWidth: 1,
      borderColor: theme.border,
    },
    !isDark && styles.shadow,
    style,
  ];
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={baseStyle}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={baseStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
});

export default Card;
