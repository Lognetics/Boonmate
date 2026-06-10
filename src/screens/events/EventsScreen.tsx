import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSocialStore } from '@/store/socialStore';
import Card from '@/components/Card';
import Chip from '@/components/Chip';
import GradientButton from '@/components/GradientButton';

const CATEGORIES = ['All', 'Hangout', 'Workshop', 'Meetup', 'Outdoor', 'Sports', 'Support Group', 'Networking', 'Wellness', 'Other'];

export default function EventsScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const events = useSocialStore((s) => s.events);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'upcoming' | 'popular'>('upcoming');

  const attending = events.filter((e) => e.attending);
  const filtered = useMemo(() => {
    let r = events;
    if (cat !== 'All') r = r.filter((e) => e.category === cat);
    if (q) r = r.filter((e) => (e.title + ' ' + e.location).toLowerCase().includes(q.toLowerCase()));
    if (sortBy === 'popular') r = [...r].sort((a, b) => b.going - a.going);
    return r;
  }, [events, cat, q, sortBy]);

  const filterCount = (dateRange !== 'all' ? 1 : 0) + (sortBy !== 'upcoming' ? 1 : 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.3 }}>{t('events.title')}</Text>
          <Text style={{ color: theme.textMuted, marginTop: 2, fontSize: 12 }}>{t('events.sub')}</Text>
        </View>
        <GradientButton title={`+ ${t('events.create')}`} size="sm" onPress={() => nav.navigate('CreateEvent')} />
      </View>

      <View style={[styles.searchRow]}>
        <View style={[styles.search, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search events, locations…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, marginLeft: 8, color: theme.text }}
          />
        </View>
        <TouchableOpacity onPress={() => setShowFilters(true)} style={[styles.filterBtn, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Ionicons name="options-outline" size={18} color={theme.text} />
          {filterCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{filterCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={styles.chipRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 8, alignItems: 'center' }}
        >
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={cat === c} onPress={() => setCat(c)} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: 18, paddingBottom: 100, gap: 10 }}
        ListHeaderComponent={
          attending.length > 0 ? (
            <View>
              <View style={styles.attendingRow}>
                <Text style={{ fontSize: 14 }}>🎟️</Text>
                <Text style={{ color: theme.text, fontWeight: '800', marginLeft: 6 }}>{t('events.attending')}</Text>
              </View>
              {attending.map((e) => (
                <EventRow key={`a_${e.id}`} ev={e} />
              ))}
              <Text style={{ color: theme.textMuted, marginTop: 14, marginBottom: 6 }}>
                {t('events.found', { count: filtered.length })}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => <EventRow ev={item} />}
      />

      <Modal transparent visible={showFilters} animationType="slide" onRequestClose={() => setShowFilters(false)}>
        <Pressable style={[styles.modalBackdrop, { backgroundColor: theme.overlay }]} onPress={() => setShowFilters(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.modalHeader, { borderColor: theme.border }]}>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 17 }}>{t('events.filters')}</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close-circle" size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>{t('events.date_range')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {(['all', 'today', 'week', 'month'] as const).map((d) => (
                <Chip
                  key={d}
                  label={d === 'all' ? `📅 ${t('events.all_time')}` : d === 'today' ? t('events.today') : d === 'week' ? t('events.this_week') : t('events.this_month')}
                  selected={dateRange === d}
                  onPress={() => setDateRange(d)}
                />
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text, marginTop: 18 }]}>{t('events.sort_by')}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Chip label={`📆 ${t('events.upcoming')}`} selected={sortBy === 'upcoming'} onPress={() => setSortBy('upcoming')} />
              <Chip label={`🔥 ${t('events.popular')}`} selected={sortBy === 'popular'} onPress={() => setSortBy('popular')} />
            </View>

            <View style={{ marginTop: 24 }}>
              <GradientButton title={t('events.reset')} variant="outline" onPress={() => { setDateRange('all'); setSortBy('upcoming'); }} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function EventRow({ ev }: { ev: any }) {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  return (
    <Card onPress={() => nav.navigate('EventDetail', { id: ev.id })} style={{ marginBottom: 10 }}>
      <View style={styles.evRow}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 12 }}>{ev.emoji} {ev.category}</Text>
            {ev.past ? (
              <View style={[styles.pastTag, { backgroundColor: theme.chipBg }]}>
                <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '700' }}>Past</Text>
              </View>
            ) : null}
          </View>
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 14, marginTop: 6, letterSpacing: -0.2 }}>{ev.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={11} color={theme.textMuted} />
              <Text style={{ color: theme.textMuted, fontSize: 11 }}>{ev.time}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-outline" size={11} color={theme.textMuted} />
              <Text style={{ color: theme.textMuted, fontSize: 11 }}>{ev.location}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="people-outline" size={11} color={theme.textMuted} />
              <Text style={{ color: theme.textMuted, fontSize: 11 }}>{t('events.going', { count: ev.going })}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.dateBox, { backgroundColor: theme.primarySoft }]}>
          <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 10 }}>{ev.date.split(' ')[0]}</Text>
          <Text style={{ color: theme.primary, fontWeight: '900', fontSize: 16 }}>{ev.date.split(' ')[1]}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 10 },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 18, marginTop: 14 },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, height: 44 },
  filterBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  chipRow: { height: 44, marginTop: 12, marginBottom: 4 },
  badge: { position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  attendingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  evRow: { flexDirection: 'row', alignItems: 'center' },
  dateBox: { width: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 8, marginLeft: 10 },
  pastTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 1, marginBottom: 16 },
  label: { fontWeight: '800' },
});
