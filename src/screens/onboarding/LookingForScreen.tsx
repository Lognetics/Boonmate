import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import Chip from '@/components/Chip';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';

const OPTIONS = [
  'Best friends', 'Workout buddies', 'Hiking crew', 'Book club', 'Co-founders', 'Mentors',
  'Hangouts in my city', 'Online communities', 'Wellness peers', 'Creative collaborators',
];

export default function LookingForScreen() {
  const { t } = useT();
  const nav = useNavigation<any>();
  const draft = useAuthStore((s) => s.draft);
  const toggle = useAuthStore((s) => s.toggleDraft);
  return (
    <OnboardingFrame
      step={7}
      total={10}
      title={t('onboarding.looking_for')}
      caption={t('onboarding.looking_for_sub')}
      primary={t('common.continue')}
      onPrimary={() => nav.navigate('Availability')}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {OPTIONS.map((o) => (
          <Chip key={o} label={o} selected={draft.lookingFor.includes(o)} onPress={() => toggle('lookingFor', o)} />
        ))}
      </View>
    </OnboardingFrame>
  );
}
