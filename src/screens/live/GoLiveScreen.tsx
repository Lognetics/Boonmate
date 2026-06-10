import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import GradientButton from '@/components/GradientButton';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import type { LiveAudience } from '@/utils/types';

const AUDIENCES: { id: LiveAudience; label: string; sub: string; icon: any }[] = [
  { id: 'public', label: 'Public', sub: 'Anyone on Boonmate can join', icon: 'globe-outline' },
  { id: 'followers', label: 'Followers', sub: 'Only people who follow you', icon: 'people-outline' },
  { id: 'circle', label: 'A Circle', sub: 'Just one community', icon: 'lock-closed-outline' },
];

export default function GoLiveScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const circles = useSocialStore((s) => s.circles);
  const startLive = useSocialStore((s) => s.startLive);
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState<LiveAudience>('public');
  const [circleId, setCircleId] = useState<string | undefined>();
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const canGo = title.trim().length > 0 && (audience !== 'circle' || !!circleId);

  const onGo = () => {
    if (!canGo) return;
    const id = startLive(title.trim(), audience, audience === 'circle' ? circleId : undefined);
    nav.replace('LiveViewer', { id });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={[styles.header, { borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="close" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15 }}>Go Live</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <View style={styles.cameraWrap}>
          <LinearGradient colors={['#1F1B2A', '#0B0B0F']} style={styles.cameraFrame}>
            {cameraOn ? (
              <View style={styles.cameraInner}>
                <Animated.View style={[styles.lensRing, { opacity: pulse, transform: [{ scale: pulse }] }]}>
                  <LinearGradient colors={theme.primaryGradient} style={styles.lensCore}>
                    <Ionicons name="videocam" size={28} color="#fff" />
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.cameraLabel}>Camera Preview</Text>
                <Text style={styles.cameraHint}>Your environment will appear here</Text>
              </View>
            ) : (
              <View style={styles.cameraInner}>
                <Ionicons name="videocam-off" size={36} color="#fff" />
                <Text style={[styles.cameraLabel, { marginTop: 8 }]}>Camera off</Text>
              </View>
            )}

            <View style={styles.cameraOverlay}>
              <View style={styles.previewBadge}>
                <View style={styles.previewDot} />
                <Text style={styles.previewText}>PREVIEW</Text>
              </View>
              <View style={styles.cameraActions}>
                <TouchableOpacity onPress={() => setMicOn(!micOn)} style={[styles.camBtn, { backgroundColor: micOn ? 'rgba(255,255,255,0.18)' : '#EF4444' }]}>
                  <Ionicons name={micOn ? 'mic' : 'mic-off'} size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCameraOn(!cameraOn)} style={[styles.camBtn, { backgroundColor: cameraOn ? 'rgba(255,255,255,0.18)' : '#EF4444' }]}>
                  <Ionicons name={cameraOn ? 'videocam' : 'videocam-off'} size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.camBtn, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Ionicons name="camera-reverse" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.hostRow}>
          <Avatar uri={user.avatar} name={user.name} size={36} ring />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 13 }}>{user.name}</Text>
            <Text style={{ color: theme.textMuted, fontSize: 11 }}>Host</Text>
          </View>
        </View>

        <Text style={[styles.label, { color: theme.textMuted }]}>What are you doing?</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Sunset run · Live Q&A · Studio session…"
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          maxLength={80}
        />
        <Text style={{ color: theme.textMuted, fontSize: 10, textAlign: 'right', marginTop: 4 }}>{title.length}/80</Text>

        <Text style={[styles.label, { color: theme.textMuted, marginTop: 10 }]}>Who can watch?</Text>
        <View style={{ gap: 8 }}>
          {AUDIENCES.map((a) => {
            const sel = audience === a.id;
            return (
              <Card key={a.id} onPress={() => setAudience(a.id)} style={{ borderColor: sel ? theme.primary : theme.border, borderWidth: 1.5 }} padding={12}>
                <View style={styles.audienceRow}>
                  <View style={[styles.audIcon, { backgroundColor: theme.primarySoft }]}>
                    <Ionicons name={a.icon} size={16} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: theme.text, fontWeight: '800', fontSize: 13 }}>{a.label}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>{a.sub}</Text>
                  </View>
                  {sel ? <Ionicons name="checkmark-circle" size={18} color={theme.primary} /> : null}
                </View>
              </Card>
            );
          })}
        </View>

        {audience === 'circle' ? (
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Pick a circle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {circles.slice(0, 8).map((c) => {
                const sel = circleId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setCircleId(c.id)}
                    style={[
                      styles.circleChip,
                      { backgroundColor: sel ? theme.primary : theme.card, borderColor: sel ? theme.primary : theme.border },
                    ]}
                  >
                    <Text style={{ color: sel ? '#fff' : theme.text, fontWeight: '700', fontSize: 12 }}>{c.emoji} {c.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        <View style={{ marginTop: 20 }}>
          <GradientButton
            title={canGo ? '🔴  Start Streaming' : 'Add a title to start'}
            size="lg"
            disabled={!canGo}
            onPress={onGo}
          />
          <Text style={{ color: theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 10 }}>
            By going live you agree to our community guidelines. Boonmate may end streams that violate them.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1 },
  cameraWrap: { borderRadius: 18, overflow: 'hidden' },
  cameraFrame: { aspectRatio: 9 / 14, justifyContent: 'center', alignItems: 'center' },
  cameraInner: { alignItems: 'center', justifyContent: 'center' },
  lensRing: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  lensCore: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  cameraLabel: { color: '#fff', fontWeight: '800', fontSize: 14, marginTop: 14 },
  cameraHint: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 },
  cameraOverlay: { position: 'absolute', top: 12, left: 12, right: 12, bottom: 12, justifyContent: 'space-between' },
  previewBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, gap: 4 },
  previewDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#EF4444' },
  previewText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  cameraActions: { flexDirection: 'row', alignSelf: 'center', gap: 10 },
  camBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  hostRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 14, padding: 12, fontSize: 14 },
  audienceRow: { flexDirection: 'row', alignItems: 'center' },
  audIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  circleChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
});
