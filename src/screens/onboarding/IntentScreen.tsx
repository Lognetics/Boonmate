import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import OnboardingFrame from './_shared';
import Card from '@/components/Card';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';

const OPTIONS = [
  { id: 'friends', emoji: '🤝', titleKey: 'intents.friends', sub: 'Build a real, close-knit circle of friends.' },
  { id: 'network', emoji: '💼', titleKey: 'intents.network', sub: 'Connect with people in your craft and field.' },
  { id: 'explore', emoji: '🌍', titleKey: 'intents.explore', sub: 'New circles, new perspectives, new places.' },
] as const;

export default function IntentScreen() {
  const { t } = useT();
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const setDraft = useAuthStore((s) => s.setDraft);
  const [sel, setSel] = useState<'friends' | 'network' | 'explore' | null>('friends');
  return (
    <OnboardingFrame
      step={6}
      total={10}
      title={t('onboarding.intent')}
      caption={t('onboarding.intent_sub')}
      primary={t('common.continue')}
      primaryDisabled={!sel}
      onPrimary={() => {
        setDraft({ intent: sel ?? undefined });
        nav.navigate('LookingFor');
      }}
    >
      <View style={{ gap: 12 }}>
        {OPTIONS.map((o) => {
          const isSel = sel === o.id;
          return (
            <Card key={o.id} onPress={() => setSel(o.id)} style={{ borderColor: isSel ? theme.primary : theme.border, borderWidth: 1.5 }}>
              <View style={styles.row}>
                <Text style={{ fontSize: 28, marginRight: 12 }}>{o.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>{t(o.titleKey)}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>{o.sub}</Text>
                </View>
                {isSel ? <Ionicons name="checkmark-circle" size={22} color={theme.primary} /> : null}
              </View>
            </Card>
          );
        })}
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
