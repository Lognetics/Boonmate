import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '@/components/GradientButton';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  step?: number;
  total?: number;
  title: string;
  caption?: string;
  primary?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  secondary?: string;
  onSecondary?: () => void;
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

export function ProgressDots({ step, total }: { step: number; total: number }) {
  const { theme } = useTheme();
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <LinearGradient
          key={i}
          colors={i < step ? theme.primaryGradient : [theme.border, theme.border]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.dot, { width: i === step - 1 ? 28 : 10 }]}
        />
      ))}
    </View>
  );
}

const OnboardingFrame: React.FC<Props> = ({
  step,
  total,
  title,
  caption,
  primary,
  onPrimary,
  primaryDisabled,
  secondary,
  onSecondary,
  children,
  scroll = true,
  contentStyle,
}) => {
  const { theme } = useTheme();
  const inner = (
    <View style={[styles.body, contentStyle]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {caption ? <Text style={[styles.caption, { color: theme.textMuted }]}>{caption}</Text> : null}
      <View style={{ marginTop: 20 }}>{children}</View>
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {step && total ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <ProgressDots step={step} total={total} />
        </View>
      ) : null}
      {scroll ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
      {primary || secondary ? (
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          {primary ? <GradientButton title={primary} onPress={onPrimary} disabled={primaryDisabled} size="lg" /> : null}
          {secondary ? (
            <View style={{ marginTop: 10 }}>
              <GradientButton title={secondary} onPress={onSecondary} variant="ghost" />
            </View>
          ) : null}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: { paddingHorizontal: 22, paddingTop: 24 },
  title: { fontSize: 26, fontWeight: '800' },
  caption: { fontSize: 15, marginTop: 6 },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
});

export default OnboardingFrame;
