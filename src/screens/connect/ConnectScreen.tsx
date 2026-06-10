import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useSocialStore } from '@/store/socialStore';
import Card from '@/components/Card';
import Chip from '@/components/Chip';
import Avatar from '@/components/Avatar';
import BadgePill from '@/components/BadgePill';
import GradientButton from '@/components/GradientButton';
import { CIRCLE_CATEGORIES } from '@/services/mockData';

export default function ConnectScreen() {
  const { theme } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const circles = useSocialStore((s) => s.circles);
  const users = useSocialStore((s) => s.users);
  const toggleConnect = useSocialStore((s) => s.toggleConnect);
  const [tab, setTab] = useState<'Circles' | 'People'>('Circles');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');

  const filteredCircles = useMemo(() => {
    return circles
      .filter((c) => (cat === 'All' ? true : c.category === cat))
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  }, [circles, cat, q]);

  const filteredPeople = useMemo(
    () => users.filter((u) => (u.name + ' ' + u.interests.join(' ')).toLowerCase().includes(q.toLowerCase())),
    [users, q],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={{ paddingHorizontal: 18, paddingTop: 8 }}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.3 }}>{t('connect.title')}</Text>
        <Text style={{ color: theme.textMuted, marginTop: 2, fontSize: 12 }}>{t('connect.sub')}</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: theme.card }]}>
        {(['Circles', 'People'] as const).map((tName) => {
          const sel = tab === tName;
          return (
            <TouchableOpacity key={tName} onPress={() => setTab(tName)} style={{ flex: 1 }}>
              <View style={[styles.tab, sel && { backgroundColor: theme.background }]}>
                <Text style={{ color: sel ? theme.text : theme.textMuted, fontWeight: '700', fontSize: 13 }}>
                  {tName === 'Circles' ? t('connect.circles') : t('connect.people')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.searchRow]}>
        <View style={[styles.search, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={tab === 'Circles' ? 'Search circles…' : 'Search people, interests…'}
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, marginLeft: 8, color: theme.text }}
          />
        </View>
        <LinearGradient colors={theme.primaryGradient} style={styles.plus}>
          <TouchableOpacity style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {tab === 'Circles' ? (
        <>
          <View style={styles.chipRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 18, gap: 8, alignItems: 'center' }}
            >
              {CIRCLE_CATEGORIES.map((c) => (
                <Chip key={c} label={`${catEmoji(c)} ${c}`} selected={cat === c} onPress={() => setCat(c)} />
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredCircles}
            keyExtractor={(c) => c.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, paddingHorizontal: 18 }}
            contentContainerStyle={{ paddingTop: 4, paddingBottom: 100, gap: 12 }}
            renderItem={({ item }) => (
              <Card
                style={[styles.circleCard, { borderColor: item.joined ? theme.primary : theme.border }]}
                padding={12}
                onPress={() => nav.navigate('CircleDetail', { id: item.id })}
              >
                <View style={[styles.circleIcon, { backgroundColor: theme.primarySoft }]}>
                  <Ionicons name="people" size={18} color={theme.primary} />
                </View>
                <Text numberOfLines={1} style={{ color: theme.text, fontWeight: '800', fontSize: 14, marginTop: 8 }}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
                  {item.members} {t('connect.members')}
                </Text>
                <Text numberOfLines={2} style={{ color: theme.textMuted, fontSize: 11, marginTop: 4, lineHeight: 15 }}>
                  {item.description}
                </Text>
              </Card>
            )}
          />
        </>
      ) : (
        <FlatList
          data={filteredPeople}
          keyExtractor={(u) => u.id}
          ListHeaderComponent={
            <Card style={[styles.aiCard, { borderColor: theme.primary }]}>
              <View style={styles.row}>
                <LinearGradient colors={theme.primaryGradient} style={styles.aiSparkle}>
                  <Ionicons name="sparkles" size={16} color="#fff" />
                </LinearGradient>
                <Text style={{ color: theme.text, fontWeight: '800', marginLeft: 10, fontSize: 14, letterSpacing: -0.2 }}>{t('connect.ai_suggestions')}</Text>
              </View>
              <Text style={{ color: theme.textMuted, marginTop: 8, fontSize: 12 }}>{t('connect.ai_caption')}</Text>
              <View style={{ marginTop: 12 }}>
                <GradientButton title={`✨ ${t('connect.find_my_people')}`} onPress={() => nav.navigate('BoonAIChat')} />
              </View>
            </Card>
          }
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100, gap: 12 }}
          renderItem={({ item }) => (
            <Card onPress={() => nav.navigate('UserProfile', { id: item.id })}>
              <View style={styles.row}>
                <Avatar uri={item.avatar} name={item.name} size={56} online={item.online} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.row}>
                    <Text style={{ color: theme.text, fontWeight: '800', flex: 1, fontSize: 14, letterSpacing: -0.2 }}>{item.name}</Text>
                    {item.badges?.[0] ? <BadgePill kind={item.badges[0]} compact /> : null}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Ionicons name="location-outline" size={11} color={theme.textMuted} />
                    <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 4 }}>{item.location}</Text>
                  </View>
                  <Text numberOfLines={2} style={{ color: theme.text, fontSize: 12, marginTop: 6, lineHeight: 17 }}>{item.bio}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {item.interests.slice(0, 4).map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: theme.chipBg }]}>
                    <Text style={{ color: theme.text, fontSize: 11, fontWeight: '600' }}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Ionicons name="people" size={13} color={theme.primary} />
                <Text style={{ color: theme.primary, marginLeft: 6, fontSize: 12, fontWeight: '700' }}>{item.mutualConnections} {t('connect.mutual_connections')}</Text>
              </View>
              <Text style={{ color: theme.primary, fontWeight: '700', marginTop: 6, fontSize: 12 }}>View Profile →</Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <GradientButton
                  title={item.connected ? `✓ ${t('common.connected')}` : t('common.connect')}
                  variant={item.connected ? 'outline' : 'gradient'}
                  size="sm"
                  onPress={() => toggleConnect(item.id)}
                  style={{ flex: 1 }}
                  icon={!item.connected ? <Ionicons name="person-add" size={14} color="#fff" /> : undefined}
                />
                <GradientButton title={t('common.message')} variant="outline" size="sm" style={{ flex: 1 }} onPress={() => nav.navigate('UserProfile', { id: item.id })} />
              </View>
            </Card>
          )}
        />
      )}

    </SafeAreaView>
  );
}

function catEmoji(c: string) {
  const map: Record<string, string> = {
    All: '✨', Tech: '💻', Fitness: '💪', Faith: '🙏', Creatives: '🎨', Outdoors: '🌲',
    Food: '🍕', Wellness: '🧘', Business: '💼', Education: '📚', Social: '🤝',
    Neurodivergent: '🧠', Therapy: '💜', Friendship: '🤗', Love: '❤️', Family: '👨‍👩‍👧',
  };
  return map[c] ?? '⭕';
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', marginHorizontal: 18, marginTop: 14, padding: 4, borderRadius: 14 },
  tab: { paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 18, marginTop: 12, alignItems: 'center' },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, height: 44 },
  plus: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  chipRow: { height: 44, marginTop: 12, marginBottom: 4 },
  circleCard: { flex: 1, borderRadius: 16, borderWidth: 1, aspectRatio: 1 },
  circleIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  aiCard: { marginTop: 12, borderWidth: 1 },
  aiSparkle: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});
