import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import { useSocialStore } from '@/store/socialStore';
import PostCard from '@/components/PostCard';
import Avatar from '@/components/Avatar';
import { useAuthStore } from '@/store/authStore';
import { timeAgo } from '@/utils/time';

interface Comment { id: string; authorId: string; authorName: string; text: string; at: string }

const seedComments: Record<string, Comment[]> = {
  default: [
    { id: 'c1', authorId: 'amara', authorName: 'Amara Johnson', text: 'This is exactly what I needed today 💜', at: new Date().toISOString() },
    { id: 'c2', authorId: 'marcus', authorName: 'Marcus Williams', text: 'Saved! Sharing with my circle.', at: new Date().toISOString() },
  ],
};

export default function PostDetailScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const id: string = route.params.id;
  const post = useSocialStore((s) => s.posts.find((p) => p.id === id));
  const user = useAuthStore((s) => s.user);
  const [comments, setComments] = useState<Comment[]>(seedComments.default!);
  const [text, setText] = useState('');

  if (!post) return null;

  const send = () => {
    if (!text.trim()) return;
    setComments([...comments, { id: `c_${Date.now()}`, authorId: 'me', authorName: user.name, text, at: new Date().toISOString() }]);
    setText('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>Post</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={comments}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <PostCard post={post} />
            <Text style={{ color: theme.textMuted, fontWeight: '700', marginTop: 8 }}>Comments ({comments.length})</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.comment, { borderColor: theme.border }]}>
            <Avatar size={32} name={item.authorName} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: theme.text, fontWeight: '700' }}>{item.authorName}</Text>
              <Text style={{ color: theme.text, marginTop: 2 }}>{item.text}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>{timeAgo(item.at)}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={[styles.inputRow, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <Avatar size={30} name={user.name} />
        <TextInput
          placeholder="Add a comment…"
          placeholderTextColor={theme.textMuted}
          value={text}
          onChangeText={setText}
          style={{ flex: 1, marginHorizontal: 10, color: theme.text }}
        />
        <TouchableOpacity onPress={send}>
          <Ionicons name="send" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  comment: { flexDirection: 'row', padding: 14, marginHorizontal: 16, marginBottom: 8, borderWidth: 1, borderRadius: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1 },
});
