import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import Chip from '@/components/Chip';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme/ThemeContext';

const ALL = [
  'Reading', 'Photography', 'Writing', 'Fashion', 'Yoga', 'Meditation', 'Fitness', 'Cooking',
  'Technology', 'Music', 'Hiking', 'Art', 'Design', 'Travel', 'Business', 'Mental Health',
  'Gaming', 'Coffee', 'Parenting', 'Faith', 'Volunteering', 'Cycling', 'Running', 'Dance',
];

export default function InterestsScreen() {
  const { t } = useT();
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const draft = useAuthStore((s) => s.draft);
  const toggle = useAuthStore((s) => s.toggleDraft);

  return (
    <OnboardingFrame
      step={5}
      total={10}
      title={t('onboarding.interests')}
      caption={t('onboarding.interests_sub')}
      primary={t('common.continue')}
      primaryDisabled={draft.interests.length < 3}
      onPrimary={() => nav.navigate('Intent')}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {ALL.map((i) => (
          <Chip key={i} label={i} selected={draft.interests.includes(i)} onPress={() => toggle('interests', i)} />
        ))}
      </View>
      <Text style={{ color: theme.textMuted, marginTop: 18, fontSize: 12 }}>
        Selected: {draft.interests.length}
      </Text>
    </OnboardingFrame>
  );
}
