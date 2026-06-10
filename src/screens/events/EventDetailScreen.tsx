import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSocialStore } from '@/store/socialStore';
import ScreenHeader from '@/components/ScreenHeader';
import Card from '@/components/Card';
import GradientButton from '@/components/GradientButton';
import Avatar from '@/components/Avatar';

export default function EventDetailScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const route = useRoute<any>();
  const ev = useSocialStore((s) => s.events.find((e) => e.id === route.params.id));
  const toggle = useSocialStore((s) => s.toggleAttending);
  const users = useSocialStore((s) => s.users.slice(0, 4));
  if (!ev) return null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScreenHeader title="Event" back />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient colors={theme.primaryGradient} style={styles.hero}>
          <Text style={{ fontSize: 56 }}>{ev.emoji}</Text>
          <Text style={styles.cat}>{ev.category}</Text>
          <Text style={styles.title}>{ev.title}</Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: 18, marginTop: 16 }}>
          <Card>
            <Row icon="calendar-outline" label={`${ev.date}  ·  ${ev.time}`} />
            <Row icon="location-outline" label={ev.location} />
            <Row icon="people-outline" label={`${ev.going} going`} />
          </Card>
          {ev.description ? (
            <Card style={{ marginTop: 12 }}>
              <Text style={{ color: theme.text, fontWeight: '800', marginBottom: 6 }}>About</Text>
              <Text style={{ color: theme.text, lineHeight: 21 }}>{ev.description}</Text>
            </Card>
          ) : null}

          <Card style={{ marginTop: 12 }}>
            <Text style={{ color: theme.text, fontWeight: '800', marginBottom: 10 }}>Who's coming</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {users.map((u) => <Avatar key={u.id} uri={u.avatar} name={u.name} size={36} />)}
              <View style={[styles.more, { backgroundColor: theme.chipBg }]}>
                <Text style={{ color: theme.text, fontWeight: '700' }}>+{Math.max(0, ev.going - 4)}</Text>
              </View>
            </View>
          </Card>

          <View style={{ marginTop: 18 }}>
            <GradientButton
              title={ev.attending ? `✓ Going` : `Join Event`}
              variant={ev.attending ? 'outline' : 'gradient'}
              size="lg"
              onPress={() => toggle(ev.id)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label }: { icon: any; label: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.r}>
      <Ionicons name={icon} size={18} color={theme.primary} />
      <Text style={{ color: theme.text, marginLeft: 10, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 28, alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  cat: { color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: '700' },
  title: { color: '#fff', fontWeight: '800', fontSize: 22, marginTop: 2, textAlign: 'center' },
  r: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  more: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
