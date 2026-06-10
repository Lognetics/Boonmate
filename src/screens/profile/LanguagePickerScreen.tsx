import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import ScreenHeader from '@/components/ScreenHeader';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/i18n';
import Card from '@/components/Card';

export default function LanguagePickerScreen() {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const nav = useNavigation<any>();
  const [sel, setSel] = useState(i18n.language);

  const pick = async (code: string) => {
    setSel(code);
    await changeLanguage(code);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScreenHeader title="Language" back />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80, gap: 8 }}>
        {SUPPORTED_LANGUAGES.map((l) => (
          <Card key={l.code} onPress={() => pick(l.code)} style={{ borderColor: sel === l.code ? theme.primary : theme.border, borderWidth: 1.5 }}>
            <View style={styles.row}>
              <Text style={{ fontSize: 22, marginRight: 12 }}>{l.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '700' }}>{l.native}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12 }}>{l.label}</Text>
              </View>
              {sel === l.code ? <Ionicons name="checkmark-circle" size={22} color={theme.primary} /> : null}
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
