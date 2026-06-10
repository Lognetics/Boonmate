import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import GradientButton from '@/components/GradientButton';
import { institutions } from '@/services/mockData';

export default function SurrogacyScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScreenHeader title={t('surrogacy.title')} caption={t('surrogacy.sub')} back />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
        <View style={[styles.disclaimer, { backgroundColor: theme.warning + '11', borderColor: theme.warning }]}>
          <Ionicons name="warning" size={18} color={theme.warning} />
          <Text style={{ color: theme.warning, marginLeft: 10, flex: 1, fontWeight: '600', lineHeight: 19 }}>
            {t('surrogacy.disclaimer')}
          </Text>
        </View>

        <View style={{ marginTop: 14, gap: 12 }}>
          {institutions.map((inst) => (
            <Card key={inst.id}>
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
                  <Ionicons name="business-outline" size={20} color={theme.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: theme.text, fontWeight: '800' }}>{inst.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons name="location-outline" size={12} color={theme.textMuted} />
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginLeft: 4 }}>{inst.location}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ color: theme.text, marginTop: 10, lineHeight: 20 }}>{inst.description}</Text>
              <View style={{ marginTop: 12, gap: 6 }}>
                {inst.contact.phone ? (
                  <View style={styles.row}><Ionicons name="call-outline" size={14} color={theme.textMuted} /><Text style={{ color: theme.textMuted, marginLeft: 8 }}>{inst.contact.phone}</Text></View>
                ) : null}
                {inst.contact.email ? (
                  <View style={styles.row}><Ionicons name="mail-outline" size={14} color={theme.textMuted} /><Text style={{ color: theme.textMuted, marginLeft: 8 }}>{inst.contact.email}</Text></View>
                ) : null}
                {inst.contact.website ? (
                  <View style={styles.row}><Ionicons name="globe-outline" size={14} color={theme.textMuted} /><Text style={{ color: theme.textMuted, marginLeft: 8 }}>{inst.contact.website}</Text></View>
                ) : null}
              </View>
              <View style={{ marginTop: 12 }}>
                <GradientButton title={t('surrogacy.contact')} size="sm" />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  disclaimer: { flexDirection: 'row', borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'flex-start' },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
