import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useSocialStore } from '@/store/socialStore';
import { useAuthStore } from '@/store/authStore';
import { liveStarterComments } from '@/services/mockData';
import Avatar from '@/components/Avatar';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  isMine?: boolean;
}

interface FloatingReaction { id: string; emoji: string; offset: number }

const REACTIONS = ['❤️', '👏', '🔥', '✨', '💜'] as const;

export default function LiveViewerScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params.id;
  const stream = useSocialStore((s) => s.liveStreams.find((x) => x.id === id));
  const bumpViewers = useSocialStore((s) => s.bumpLiveViewers);
  const endLive = useSocialStore((s) => s.endLive);
  const user = useAuthStore((s) => s.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [elapsed, setElapsed] = useState('00:00');
  const startedAtRef = useRef(stream ? new Date(stream.startedAt).getTime() : Date.now());
  const listRef = useRef<FlatList<any>>(null);

  // Join as viewer
  useEffect(() => {
    if (!stream || stream.isMine) return;
    bumpViewers(id, 1);
    return () => bumpViewers(id, -1);
  }, [id, stream?.isMine]);

  // Auto-comments stream in
  useEffect(() => {
    if (!stream) return;
    let i = 0;
    const t = setInterval(() => {
      const c = liveStarterComments[i % liveStarterComments.length]!;
      setComments((prev) => [
        ...prev.slice(-40),
        { id: `c_${Date.now()}_${i}`, userId: `auto_${i}`, userName: c.name, userAvatar: c.avatar, text: c.text },
      ]);
      i++;
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }, 4500);
    return () => clearInterval(t);
  }, [stream?.id]);

  // Elapsed timer
  useEffect(() => {
    const t = setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setElapsed(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Floating reactions cleanup
  useEffect(() => {
    if (!reactions.length) return;
    const t = setTimeout(() => setReactions((r) => r.slice(1)), 2200);
    return () => clearTimeout(t);
  }, [reactions]);

  if (!stream) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="radio-outline" size={42} color="#fff" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Stream has ended</Text>
          <TouchableOpacity onPress={() => nav.goBack()} style={{ marginTop: 16 }}>
            <Text style={{ color: theme.primary, fontWeight: '800' }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const send = () => {
    if (!input.trim()) return;
    setComments((c) => [
      ...c.slice(-40),
      { id: `me_${Date.now()}`, userId: user.id, userName: user.name, userAvatar: user.avatar, text: input.trim(), isMine: true },
    ]);
    setInput('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const sendReaction = (emoji: string) => {
    setReactions((r) => [...r, { id: `r_${Date.now()}_${Math.random()}`, emoji, offset: Math.random() * 60 - 30 }]);
  };

  const close = () => {
    if (stream.isMine) endLive();
    nav.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground source={stream.thumbnail ? { uri: stream.thumbnail } : undefined} style={StyleSheet.absoluteFill} blurRadius={6}>
        <LinearGradient colors={['rgba(15,10,20,0.55)', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.topRow}>
          <View style={styles.hostBlock}>
            <Avatar uri={stream.hostAvatar} name={stream.hostName} size={36} ring online />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.hostName}>{stream.hostName}</Text>
              <View style={styles.hostMeta}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.elapsedText}>{elapsed}</Text>
                <View style={styles.viewerBlock}>
                  <Ionicons name="eye" size={11} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.viewerCount}>{stream.viewers}</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={close} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{stream.title}</Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Floating reactions */}
        <View pointerEvents="none" style={styles.reactionsLayer}>
          {reactions.map((r, idx) => (
            <FloatingEmoji key={r.id} emoji={r.emoji} offset={r.offset} index={idx} />
          ))}
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.commentsArea}>
            <FlatList
              ref={listRef}
              data={comments}
              keyExtractor={(c) => c.id}
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  <Avatar uri={item.userAvatar} name={item.userName} size={22} />
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentName}>{item.userName}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                  </View>
                </View>
              )}
              style={{ maxHeight: 220 }}
              contentContainerStyle={{ paddingHorizontal: 14, gap: 4, paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.inputBox}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Say something nice…"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                onSubmitEditing={send}
                returnKeyType="send"
              />
            </View>
            {REACTIONS.map((r) => (
              <TouchableOpacity key={r} onPress={() => sendReaction(r)} style={styles.reactBtn}>
                <Text style={{ fontSize: 18 }}>{r}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={send} style={styles.sendBtn}>
              <LinearGradient colors={theme.primaryGradient} style={styles.sendGrad}>
                <Ionicons name="send" size={14} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function FloatingEmoji({ emoji, offset, index }: { emoji: string; offset: number; index: number }) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(y, { toValue: -240, duration: 2000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 2000, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 90,
        right: 40 + offset,
        transform: [{ translateY: y }],
        opacity,
      }}
    >
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 6 },
  hostBlock: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 999, padding: 6, paddingRight: 12, alignSelf: 'flex-start' },
  hostName: { color: '#fff', fontWeight: '800', fontSize: 13 },
  hostMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, gap: 3 },
  liveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff' },
  liveText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  elapsedText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700' },
  viewerBlock: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  viewerCount: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  titleRow: { paddingHorizontal: 14, marginTop: 10 },
  title: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  reactionsLayer: { ...StyleSheet.absoluteFillObject },
  commentsArea: { paddingBottom: 6 },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  commentBubble: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  commentName: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '800' },
  commentText: { color: '#fff', fontSize: 13, marginTop: 1 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10, gap: 6 },
  inputBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 14, height: 38, justifyContent: 'center' },
  input: { color: '#fff', fontSize: 13 },
  reactBtn: { width: 32, height: 38, alignItems: 'center', justifyContent: 'center' },
  sendBtn: { width: 38, height: 38, borderRadius: 19, overflow: 'hidden' },
  sendGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
