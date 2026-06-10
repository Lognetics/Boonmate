import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import Chip from '@/components/Chip';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';

const OPTIONS = [
  '🌞 Sunny extrovert',
  '🌙 Quiet introvert',
  '🌗 Ambivert',
  '🌱 Growth-mode',
  '🎨 Creative spirit',
  '🧘 Grounded',
  '🚀 Ambitious',
  '💜 Empathic',
];

export default function PersonalityScreen() {
  const { t } = useT();
  const nav = useNavigation<any>();
  const setDraft = useAuthStore((s) => s.setDraft);
  const [sel, setSel] = useState<string | null>(null);
  return (
    <OnboardingFrame
      step={3}
      total={10}
      title={t('onboarding.personality')}
      caption={t('onboarding.personality_sub')}
      primary={t('common.continue')}
      onPrimary={() => {
        setDraft({ personality: sel ?? undefined });
        nav.navigate('LifeStage');
      }}
      primaryDisabled={!sel}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {OPTIONS.map((o) => (
          <Chip key={o} label={o} selected={sel === o} onPress={() => setSel(o)} />
        ))}
      </View>
    </OnboardingFrame>
  );
}
