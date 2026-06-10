import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import Chip from '@/components/Chip';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';

const OPTIONS = [
  'In school / training',
  'Just starting out',
  'Building my career',
  'Mid-career',
  'Settled & exploring',
  'Parenting season',
  'Starting over',
  'Retired / freelance',
];

export default function LifeStageScreen() {
  const { t } = useT();
  const nav = useNavigation<any>();
  const setDraft = useAuthStore((s) => s.setDraft);
  const [sel, setSel] = useState<string | null>(null);
  return (
    <OnboardingFrame
      step={4}
      total={10}
      title={t('onboarding.life_stage')}
      caption={t('onboarding.life_stage_sub')}
      primary={t('common.continue')}
      primaryDisabled={!sel}
      onPrimary={() => {
        setDraft({ lifeStage: sel ?? undefined });
        nav.navigate('Interests');
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {OPTIONS.map((o) => (
          <Chip key={o} label={o} selected={sel === o} onPress={() => setSel(o)} />
        ))}
      </View>
    </OnboardingFrame>
  );
}
