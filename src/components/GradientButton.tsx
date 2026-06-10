import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'gradient' | 'outline' | 'ghost' | 'soft';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md' | 'lg';
}

const GradientButton: React.FC<Props> = ({
  title,
  onPress,
  loading,
  disabled,
  variant = 'gradient',
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const { theme } = useTheme();
  const padV = size === 'lg' ? 14 : size === 'sm' ? 7 : 11;
  const fontSize = size === 'lg' ? 15 : size === 'sm' ? 12 : 13;
  const isDisabled = disabled || loading;

  const inner = (
    <View style={[styles.inner, { paddingVertical: padV }]}>
      {loading ? (
        <ActivityIndicator color={variant === 'gradient' ? '#fff' : theme.primary} />
      ) : (
        <>
          {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
          <Text
            style={[
              { fontSize, fontWeight: '700' },
              variant === 'gradient'
                ? { color: '#fff' }
                : variant === 'outline'
                  ? { color: theme.text }
                  : variant === 'soft'
                    ? { color: theme.primary }
                    : { color: theme.text },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={isDisabled} style={[styles.wrap, style, isDisabled && { opacity: 0.5 }]}>
        <LinearGradient colors={theme.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.grad}>
          {inner}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const bg =
    variant === 'outline' ? 'transparent' : variant === 'soft' ? theme.primarySoft : 'transparent';
  const border = variant === 'outline' ? theme.border : 'transparent';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.wrap, { backgroundColor: bg, borderColor: border, borderWidth: variant === 'outline' ? 1 : 0 }, style, isDisabled && { opacity: 0.5 }]}
    >
      {inner}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: { borderRadius: 14, overflow: 'hidden' },
  grad: { borderRadius: 14 },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
});

export default GradientButton;
