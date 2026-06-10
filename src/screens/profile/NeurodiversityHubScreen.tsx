import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSocialStore } from '@/store/socialStore';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import GradientButton from '@/components/GradientButton';
import ConsentModal from '@/components/ConsentModal';

const ND_CIRCLES = ['autism', 'adhd', 'dyslexia', 'neurodiverse', 'sensory'];
const RESOURCES = [
  { id: 'r1', emoji: '📚', title: 'Understanding Your Brain', body: 'Guides for neurodivergent self-discovery', tone: '#3B1E4A' },
  { id: 'r2', emoji: '🧘', title: 'Regulation Strategies', body: 'Tools for emotional and sensory regulation', tone: '#1E4A3B' },
  { id: 'r3', emoji: '💬', title: 'Communication Tips', body: 'Navigating social situations on your terms', tone: '#1E2A4A' },
  { id: 'r4', emoji: '💼', title: 'Work & Productivity', body: 'Thriving in environments built for neurotypicals', tone: '#4A3B1E' },
];

export default function NeurodiversityHubScreen() {
  const { theme, lowStimulation, setLowStimulation } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const circles = useSocialStore((s) => s.circles).filter((c) => ND_CIRCLES.includes(c.id));
  const setJoined = useSocialStore((s) => s.setCircleJoined);
  const [ndMode, setNdMode] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScreenHeader title={t('neuro.title')} caption={t('neuro.sub')} back />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 80 }}>
        <Card style={{ borderColor: theme.accent, borderWidth: 1.5 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 22, marginRight: 8 }}>🧠</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>{t('neuro.belong')}</Text>
              <Text style={{ color: theme.textMuted, marginTop: 6, lineHeight: 19 }}>{t('neuro.belong_sub')}</Text>
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: 12, borderColor: theme.success, borderWidth: 1.5 }}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.success} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: theme.text, fontWeight: '800' }}>{t('neuro.low_stim')}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{t('neuro.low_stim_sub')}</Text>
            </View>
            <Switch value={lowStimulation} onValueChange={setLowStimulation} trackColor={{ true: theme.success, false: theme.border }} />
          </View>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <View style={styles.row}>
            <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="heart-outline" size={18} color={theme.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: theme.text, fontWeight: '800' }}>{t('neuro.nd_friendly')}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{t('neuro.nd_friendly_sub')}</Text>
            </View>
            <Switch value={ndMode} onValueChange={setNdMode} trackColor={{ true: theme.primary, false: theme.border }} />
          </View>
        </Card>

        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('neuro.communities')}</Text>
        {circles.map((c) => (
          <Card key={c.id} style={{ marginBottom: 10 }}>
            <View style={styles.row}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>{c.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '800' }}>{c.name}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{c.description}</Text>
                <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 12, marginTop: 4 }}>{c.members.toLocaleString()} members</Text>
              </View>
              <GradientButton
                title={c.joined ? t('common.leave') : t('common.join')}
                variant={c.joined ? 'outline' : 'gradient'}
                size="sm"
                onPress={() => (c.joined ? setJoined(c.id, false) : setPending(c.id))}
              />
            </View>
          </Card>
        ))}

        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{t('neuro.resources')}</Text>
        <View style={styles.grid}>
          {RESOURCES.map((r) => (
            <Card key={r.id} style={[styles.resource, { backgroundColor: r.tone + '55', borderWidth: 0 }]}>
              <Text style={{ fontSize: 26 }}>{r.emoji}</Text>
              <Text style={{ color: theme.text, fontWeight: '800', marginTop: 6 }}>{r.title}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>{r.body}</Text>
            </Card>
          ))}
        </View>

        <Card style={{ marginTop: 12, borderColor: theme.accent, borderWidth: 1.5 }}>
          <TouchableOpacity onPress={() => nav.navigate('Therapists')} style={styles.row}>
            <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: theme.text, fontWeight: '800' }}>{t('neuro.talk_specialist')}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{t('neuro.talk_specialist_sub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <ConsentModal
        visible={!!pending}
        circle={circles.find((c) => c.id === pending) ?? null}
        onAccept={() => {
          if (pending) setJoined(pending, true);
          setPending(null);
        }}
        onDecline={() => setPending(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginTop: 22, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  resource: { width: '48%', padding: 14, borderRadius: 16 },
});
