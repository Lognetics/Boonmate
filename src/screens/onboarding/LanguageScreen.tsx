import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import OnboardingFrame from './_shared';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/Card';

export default function LanguageScreen() {
  const { theme } = useTheme();
  const { t, lang } = useT();
  const nav = useNavigation<any>();
  const setDraft = useAuthStore((s) => s.setDraft);
  const [selected, setSelected] = useState(lang || 'en');

  const pick = async (code: string) => {
    setSelected(code);
    await changeLanguage(code);
    setDraft({ language: code });
  };

  return (
    <OnboardingFrame
      step={1}
      total={10}
      title={t('onboarding.language_title')}
      caption={t('onboarding.language_sub')}
      primary={t('common.continue')}
      onPrimary={() => nav.navigate('SignUp')}
    >
      <View style={{ gap: 10 }}>
        {SUPPORTED_LANGUAGES.map((l) => {
          const isSel = l.code === selected;
          return (
            <Card key={l.code} onPress={() => pick(l.code)} style={{ borderColor: isSel ? theme.primary : theme.border, borderWidth: 1.5 }}>
              <View style={styles.row}>
                <Text style={{ fontSize: 22, marginRight: 12 }}>{l.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>{l.native}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{l.label}</Text>
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
