import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useSocialStore } from '@/store/socialStore';
import Avatar from './Avatar';

const LiveStripe: React.FC = () => {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const streams = useSocialStore((s) => s.liveStreams);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={styles.headerRow}>
        <View style={[styles.liveDot, { backgroundColor: pulse ? '#EF4444' : '#7F1D1D' }]} />
        <Text style={{ color: theme.text, fontWeight: '900', fontSize: 13, marginLeft: 6, letterSpacing: -0.2 }}>LIVE NOW</Text>
        <Text style={{ color: theme.textMuted, fontSize: 11, marginLeft: 6 }}>· {streams.length} streaming</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 10 }}>
        <TouchableOpacity onPress={() => nav.navigate('GoLive')} activeOpacity={0.85}>
          <LinearGradient colors={theme.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.goLiveCard}>
            <View style={styles.goLiveInner}>
              <View style={styles.goLiveIcon}>
                <Ionicons name="radio-outline" size={22} color="#fff" />
              </View>
              <Text style={styles.goLiveLabel}>Go Live</Text>
              <Text style={styles.goLiveSub}>Share what{"\n"}you're doing</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {streams.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => nav.navigate('LiveViewer', { id: s.id })}
            activeOpacity={0.85}
            style={[styles.streamCard, { borderColor: theme.border, backgroundColor: theme.card }]}
          >
            {s.thumbnail ? (
              <ImageBackground source={{ uri: s.thumbnail }} style={styles.thumb} imageStyle={{ borderRadius: 14 }}>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.thumbGrad}>
                  <View style={styles.liveTag}>
                    <View style={styles.liveTagDot} />
                    <Text style={styles.liveTagText}>LIVE</Text>
                  </View>
                  <View style={styles.viewerTag}>
                    <Ionicons name="eye" size={10} color="#fff" />
                    <Text style={styles.viewerText}>{s.viewers}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            ) : null}
            <View style={styles.streamInfo}>
              <Avatar uri={s.hostAvatar} name={s.hostName} size={26} ring />
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text numberOfLines={1} style={{ color: theme.text, fontWeight: '700', fontSize: 11 }}>{s.hostName}</Text>
                <Text numberOfLines={1} style={{ color: theme.textMuted, fontSize: 10 }}>{s.title}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  goLiveCard: { width: 130, height: 175, borderRadius: 16, overflow: 'hidden' },
  goLiveInner: { flex: 1, padding: 12, justifyContent: 'space-between' },
  goLiveIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  goLiveLabel: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: -0.3, marginTop: 6 },
  goLiveSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
  streamCard: { width: 130, height: 175, borderRadius: 16, borderWidth: 1, overflow: 'hidden', padding: 6 },
  thumb: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  thumbGrad: { flex: 1, borderRadius: 14, padding: 8, justifyContent: 'space-between' },
  liveTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 4 },
  liveTagDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#fff' },
  liveTagText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  viewerTag: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 3 },
  viewerText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  streamInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 6, paddingHorizontal: 2 },
});

export default LiveStripe;
