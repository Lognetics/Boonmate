import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import Chip from '@/components/Chip';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';

const OPTIONS = [
  'Weekday mornings', 'Weekday lunch', 'Weekday evenings', 'Saturday mornings',
  'Saturday afternoons', 'Saturday nights', 'Sundays', 'Late night',
];

export default function AvailabilityScreen() {
  const { t } = useT();
  const nav = useNavigation<any>();
  const draft = useAuthStore((s) => s.draft);
  const toggle = useAuthStore((s) => s.toggleDraft);
  return (
    <OnboardingFrame
      step={8}
      total={10}
      title={t('onboarding.availability')}
      caption={t('onboarding.availability_sub')}
      primary={t('common.continue')}
      onPrimary={() => nav.navigate('CircleSuggestions')}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {OPTIONS.map((o) => (
          <Chip key={o} label={o} selected={draft.availability.includes(o)} onPress={() => toggle('availability', o)} />
        ))}
      </View>
    </OnboardingFrame>
  );
}
