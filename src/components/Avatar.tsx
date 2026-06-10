import React from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  uri?: string | null;
  name?: string;
  size?: number;
  online?: boolean;
  style?: StyleProp<ViewStyle>;
  ring?: boolean;
}

function initials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

const Avatar: React.FC<Props> = ({ uri, name, size = 44, online, style, ring }) => {
  const { theme } = useTheme();
  const base = (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : (
        <Text style={{ color: theme.primary, fontWeight: '700', fontSize: size * 0.4 }}>{initials(name)}</Text>
      )}
    </View>
  );

  return (
    <View style={[{ width: size, height: size }, style]}>
      {ring ? (
        <LinearGradient colors={theme.primaryGradient} style={{ padding: 2, borderRadius: size / 2 + 2 }}>
          {base}
        </LinearGradient>
      ) : (
        base
      )}
      {online ? (
        <View
          style={[
            styles.dot,
            { backgroundColor: theme.success, borderColor: theme.background, width: size * 0.28, height: size * 0.28, borderRadius: (size * 0.28) / 2 },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: { position: 'absolute', bottom: 0, right: 0, borderWidth: 2 },
});

export default Avatar;
