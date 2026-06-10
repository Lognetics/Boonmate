import React, { useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useT } from '@/hooks/useT';
import { useAuthStore } from '@/store/authStore';
import { useSocialStore } from '@/store/socialStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import Avatar from '@/components/Avatar';
import BadgePill from '@/components/BadgePill';
import GradientButton from '@/components/GradientButton';
import Card from '@/components/Card';
import { gallery } from '@/services/mockData';

type Tab = 'About' | 'Circles' | 'Posts' | 'Gallery';

export default function ProfileScreen() {
  const { theme, isDark, toggle } = useTheme();
  const { t } = useT();
  const nav = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const myCircles = useSocialStore((s) => s.circles.filter((c) => user.circles.includes(c.id) || c.joined));
  const allPosts = useSocialStore((s) => s.posts);
  const myPosts = allPosts.filter((p) => p.authorId === user.id);
  const fallbackPosts = allPosts.slice(0, 5);
  const { plan } = useSubscriptionStore();
  const [tab, setTab] = useState<Tab>('About');
  const [photos, setPhotos] = useState<string[]>(gallery);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
    if (!r.canceled && r.assets[0]) updateProfile({ avatar: r.assets[0].uri });
  };

  const addPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!r.canceled && r.assets[0]) setPhotos([r.assets[0].uri, ...photos]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', flex: 1, letterSpacing: -0.3 }}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={toggle} style={styles.iconBtn}>
          <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('Settings')} style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          <LinearGradient colors={theme.primaryGradient} style={styles.cover} />
          <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrap} activeOpacity={0.8}>
            <Avatar uri={user.avatar} name={user.name} size={104} ring />
            <View style={[styles.avEditBtn, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="camera" size={14} color={theme.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.editBtnWrap}>
            <GradientButton title={`✎ ${t('profile.edit')}`} variant="soft" size="sm" onPress={() => nav.navigate('EditProfile')} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 18, marginTop: 56 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.3 }}>{user.name}</Text>
          <View style={[styles.statusPill, { backgroundColor: theme.primarySoft }]}>
            <View style={[styles.dot, { backgroundColor: theme.success }]} />
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: '700' }}>{t('profile.available')}</Text>
          </View>

          <View style={[styles.statsRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Stat n="1" label={t('profile.connections')} />
            <View style={[styles.statsDivider, { backgroundColor: theme.border }]} />
            <Stat n={String(myCircles.length)} label={t('profile.circles_count')} />
            <View style={[styles.statsDivider, { backgroundColor: theme.border }]} />
            <Stat n={String(myPosts.length || 15)} label={t('profile.posts_count')} />
          </View>

          <Text style={{ color: theme.text, fontWeight: '800', marginTop: 18 }}>🏆 {t('profile.badges')}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            {(user.badges ?? []).map((b) => <BadgePill key={b} kind={b} />)}
          </View>

          <View style={[styles.tabsRow, { borderColor: theme.border }]}>
            {(['About', 'Circles', 'Posts', 'Gallery'] as const).map((tName) => {
              const sel = tab === tName;
              return (
                <TouchableOpacity key={tName} onPress={() => setTab(tName)} style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                  <Text style={{ color: sel ? theme.primary : theme.textMuted, fontWeight: '700' }}>{tName}</Text>
                  {sel ? <View style={[styles.tabUnderline, { backgroundColor: theme.primary }]} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {tab === 'About' ? (
            <View>
              <Text style={{ color: theme.text, fontWeight: '800', marginTop: 14 }}>{t('profile.interests')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {user.interests.map((i) => (
                  <View key={i} style={[styles.tag, { backgroundColor: theme.chipBg }]}>
                    <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>{i}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                <Text style={{ fontSize: 18, marginRight: 6 }}>🎯</Text>
                <Text style={{ color: theme.textMuted }}>{t('profile.here_to_network')}</Text>
              </View>

              <Card style={{ marginTop: 14 }}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 22, marginRight: 8 }}>🚀</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontWeight: '800' }}>Pro Plan</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }}>$10/month</Text>
                  </View>
                  <TouchableOpacity onPress={() => nav.navigate('Subscription')}>
                    <Text style={{ color: theme.primary, fontWeight: '700' }}>{t('profile.manage')} →</Text>
                  </TouchableOpacity>
                </View>
              </Card>

              <NavRow icon="sparkles-outline" label={t('profile.update_preferences')} onPress={() => nav.navigate('EditProfile')} />
              <NavRow icon="trophy-outline" label={t('profile.growth_hub')} onPress={() => nav.navigate('GrowthHub')} />
              <NavRow icon="chatbubbles-outline" label={t('profile.chat_with_boon')} onPress={() => nav.navigate('BoonAIChat')} />
              <NavRow icon="heart-outline" label={t('profile.therapists')} onPress={() => nav.navigate('Therapists')} />
              <NavRow icon="leaf-outline" label={t('profile.neurodiversity')} onPress={() => nav.navigate('NeurodiversityHub')} />
              <NavRow icon="people-outline" label="Surrogacy Info" onPress={() => nav.navigate('Surrogacy')} />
              <NavRow icon="settings-outline" label={t('profile.settings')} onPress={() => nav.navigate('Settings')} />
            </View>
          ) : null}

          {tab === 'Circles' ? (
            <View style={{ marginTop: 8 }}>
              {myCircles.map((c) => (
                <TouchableOpacity key={c.id} onPress={() => nav.navigate('CircleDetail', { id: c.id })} style={[styles.cRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={[styles.cIcon, { backgroundColor: theme.primarySoft }]}>
                    <Text style={{ fontSize: 18 }}>{c.emoji ?? '⭕'}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: theme.text, fontWeight: '700' }}>{c.name}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }}>{c.members} members</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          {tab === 'Posts' ? (
            <View style={{ marginTop: 8 }}>
              {(myPosts.length ? myPosts : fallbackPosts).map((p) => (
                <TouchableOpacity key={p.id} onPress={() => nav.navigate('PostDetail', { id: p.id })} style={[styles.pRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={{ color: theme.text, fontWeight: '600' }} numberOfLines={2}>{p.text}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 6, gap: 14 }}>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }}>❤️ {p.likes}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }}>💬 {p.comments}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          {tab === 'Gallery' ? (
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: theme.textMuted, marginBottom: 8 }}>{t('profile.photos_shared')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <TouchableOpacity onPress={addPhoto} style={[styles.galleryAdd, { borderColor: theme.border }]}>
                  <Ionicons name="add" size={28} color={theme.textMuted} />
                  <Text style={{ color: theme.textMuted, marginTop: 4, fontSize: 12 }}>{t('profile.add_photo')}</Text>
                </TouchableOpacity>
                {photos.map((p, i) => (
                  <Image key={`${p}_${i}`} source={{ uri: p }} style={styles.galleryImg} />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
      <Text style={{ color: theme.primary, fontSize: 20, fontWeight: '900' }}>{n}</Text>
      <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function NavRow({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.navRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.navIcon, { backgroundColor: theme.primarySoft }]}>
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>
      <Text style={{ color: theme.text, fontWeight: '700', flex: 1, marginLeft: 12, fontSize: 13 }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, gap: 4 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  cover: { height: 140 },
  avatarWrap: { position: 'absolute', top: 80, left: 18 },
  avEditBtn: { position: 'absolute', right: -2, bottom: -2, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  editBtnWrap: { position: 'absolute', right: 18, top: 95 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, alignSelf: 'flex-start', marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statsRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 18, marginTop: 14 },
  statsDivider: { width: 1, marginVertical: 14 },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, marginTop: 18 },
  tabUnderline: { width: 24, height: 3, borderRadius: 2, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  cRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  cIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pRow: { padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  navRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 10 },
  navIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  galleryAdd: { width: '31%', aspectRatio: 1, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  galleryImg: { width: '31%', aspectRatio: 1, borderRadius: 14 },
});
