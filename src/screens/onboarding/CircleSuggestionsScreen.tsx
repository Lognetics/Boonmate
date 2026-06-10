import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import Card from '@/components/Card';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';
import { circles } from '@/services/mockData';
import GradientButton from '@/components/GradientButton';

export default function CircleSuggestionsScreen() {
  const { t } = useT();
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const draft = useAuthStore((s) => s.draft);
  const toggle = useAuthStore((s) => s.toggleDraft);

  const suggested = circles.slice(0, 8);

  return (
    <OnboardingFrame
      step={9}
      total={10}
      title={t('onboarding.circles')}
      caption={t('onboarding.circles_sub')}
      primary={t('common.continue')}
      onPrimary={() => nav.navigate('NotificationsOptIn')}
      scroll
    >
      <View style={{ gap: 12 }}>
        {suggested.map((c) => {
          const sel = draft.chosenCircles.includes(c.id);
          return (
            <Card key={c.id}>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
                  <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontWeight: '700' }}>{c.name}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }} numberOfLines={2}>
                    {c.description}
                  </Text>
                </View>
                <GradientButton
                  title={sel ? t('common.leave') : t('common.join')}
                  variant={sel ? 'outline' : 'gradient'}
                  size="sm"
                  onPress={() => toggle('chosenCircles', c.id)}
                />
              </View>
            </Card>
          );
        })}
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
