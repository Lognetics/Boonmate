import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Chip from '@/components/Chip';
import GradientButton from '@/components/GradientButton';
import { therapists } from '@/services/mockData';

const FILTERS = ['All', 'Anxiety', 'ADHD', 'Couples', 'Trauma', 'Career'];

export default function TherapistsScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const list = filter === 'All' ? therapists : therapists.filter((t) => t.specialties.some((s) => s.toLowerCase().includes(filter.toLowerCase())));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScreenHeader title={t('therapists.title')} caption={t('therapists.sub')} back />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
        <View style={[styles.crisis, { backgroundColor: theme.danger + '11', borderColor: theme.danger }]}>
          <Ionicons name="warning" size={18} color={theme.danger} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: theme.danger, fontWeight: '800' }}>{t('therapists.crisis_title')}</Text>
            <Text style={{ color: theme.text, fontSize: 12, marginTop: 4 }}>{t('therapists.crisis_sub')}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 14 }}>
          {FILTERS.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>

        <View style={{ marginTop: 14, gap: 12 }}>
          {list.map((th) => {
            const open = expanded === th.id;
            return (
              <Card key={th.id}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(open ? null : th.id)}>
                  <View style={styles.row}>
                    <Avatar uri={th.avatar} name={th.name} size={56} online={th.availability === 'Available'} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={styles.row}>
                        <Text style={{ color: theme.text, fontWeight: '800', flex: 1 }}>{th.name}</Text>
                        <View style={[styles.verified, { backgroundColor: theme.success + '22' }]}>
                          <Ionicons name="checkmark-circle" size={12} color={theme.success} />
                          <Text style={{ color: theme.success, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>{t('therapists.verified')}</Text>
                        </View>
                      </View>
                      <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '700', marginTop: 2 }}>{th.role}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Ionicons name="location-outline" size={12} color={theme.textMuted} />
                        <Text style={{ color: theme.textMuted, fontSize: 12, marginLeft: 4 }}>{th.location}</Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12, marginLeft: 8 }}>· ⭐ {th.rating}</Text>
                      </View>
                    </View>
                  </View>

                  {open ? (
                    <View style={{ marginTop: 12 }}>
                      <Text style={{ color: theme.text, lineHeight: 20 }}>{th.bio}</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                        {th.specialties.map((s) => (
                          <View key={s} style={[styles.tag, { backgroundColor: theme.chipBg }]}>
                            <Text style={{ color: theme.text, fontSize: 11, fontWeight: '600' }}>{s}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                        <GradientButton title={t('therapists.book')} onPress={() => {}} style={{ flex: 1 }} size="sm" />
                        <GradientButton title={t('therapists.contact')} variant="outline" onPress={() => {}} style={{ flex: 1 }} size="sm" />
                      </View>
                      {th.contact.email ? <Caption icon="mail-outline" text={th.contact.email} /> : null}
                      {th.contact.phone ? <Caption icon="call-outline" text={th.contact.phone} /> : null}
                    </View>
                  ) : null}
                </TouchableOpacity>
              </Card>
            );
          })}
        </View>

        <Text style={{ color: theme.textMuted, fontSize: 11, lineHeight: 17, marginTop: 18, textAlign: 'center' }}>
          {t('therapists.disclaimer')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Caption({ icon, text }: { icon: any; text: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
      <Ionicons name={icon} size={12} color={theme.textMuted} />
      <Text style={{ color: theme.textMuted, fontSize: 12, marginLeft: 6 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  crisis: { flexDirection: 'row', borderRadius: 14, padding: 12, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  verified: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});
