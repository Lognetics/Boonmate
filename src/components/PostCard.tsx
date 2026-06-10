import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import Avatar from './Avatar';
import Card from './Card';
import type { Post } from '@/utils/types';
import { useSocialStore } from '@/store/socialStore';
import { ME_ID } from '@/services/mockData';
import { timeAgo } from '@/utils/time';

interface Props {
  post: Post;
  hideCircle?: boolean;
}

const PostCard: React.FC<Props> = ({ post, hideCircle }) => {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const toggleLike = useSocialStore((s) => s.toggleLike);
  const toggleSave = useSocialStore((s) => s.toggleSave);
  const deletePost = useSocialStore((s) => s.deletePost);
  const [menu, setMenu] = useState(false);

  const isMine = post.authorId === ME_ID;
  const openProfile = () => {
    if (isMine) {
      nav.navigate('MainTabs', { screen: 'Me' });
    } else {
      nav.navigate('UserProfile', { id: post.authorId });
    }
  };

  return (
    <Card style={{ marginBottom: 14 }}>
      <View style={styles.row}>
        <TouchableOpacity onPress={openProfile} activeOpacity={0.8}>
          <Avatar uri={post.authorAvatar} name={post.authorName} size={42} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openProfile} style={{ flex: 1, marginLeft: 10 }} activeOpacity={0.8}>
          <View style={styles.nameRow}>
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 13, letterSpacing: -0.2 }}>{post.authorName}</Text>
            {!hideCircle && post.circleName ? (
              <View style={[styles.circleTag, { backgroundColor: theme.primarySoft }]}>
                <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '700' }}>{post.circleName}</Text>
              </View>
            ) : null}
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>{timeAgo(post.createdAt)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenu(true)} style={styles.dots}>
          <Ionicons name="ellipsis-horizontal" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={() => nav.navigate('PostDetail', { id: post.id })}>
        <Text style={{ color: theme.text, marginTop: 10, fontSize: 13, lineHeight: 18 }}>{post.text}</Text>
        {post.image ? (
          <Image source={{ uri: post.image }} style={[styles.image, { borderColor: theme.border }]} />
        ) : null}
      </TouchableOpacity>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.action} onPress={() => toggleLike(post.id)}>
          <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={18} color={post.liked ? theme.primary : theme.text} />
          <Text style={[styles.actionText, { color: post.liked ? theme.primary : theme.text }]}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => nav.navigate('PostDetail', { id: post.id })}>
          <Ionicons name="chatbubble-outline" size={18} color={theme.text} />
          <Text style={[styles.actionText, { color: theme.text }]}>{post.comments}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.action} onPress={() => toggleSave(post.id)}>
          <Ionicons name={post.saved ? 'bookmark' : 'bookmark-outline'} size={16} color={post.saved ? theme.primary : theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="share-outline" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={menu} animationType="fade" onRequestClose={() => setMenu(false)}>
        <Pressable style={[styles.sheetBackdrop, { backgroundColor: theme.overlay }]} onPress={() => setMenu(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <SheetItem icon="person-circle-outline" label="View profile" onPress={() => { setMenu(false); openProfile(); }} />
            <SheetItem icon="chatbubble-outline" label="Message" onPress={() => { setMenu(false); if (!isMine) nav.navigate('UserProfile', { id: post.authorId }); }} />
            <SheetItem icon={post.saved ? 'bookmark' : 'bookmark-outline'} label={post.saved ? 'Unsave post' : 'Save post'} onPress={() => { toggleSave(post.id); setMenu(false); }} />
            <SheetItem icon="share-outline" label="Share post" onPress={() => setMenu(false)} />
            <SheetItem icon="notifications-off-outline" label="Mute author" onPress={() => setMenu(false)} />
            <SheetItem icon="flag-outline" label="Report post" onPress={() => setMenu(false)} danger />
            {isMine ? (
              <SheetItem icon="trash-outline" label="Delete post" onPress={() => { deletePost(post.id); setMenu(false); }} danger />
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </Card>
  );
};

function SheetItem({ icon, label, onPress, danger }: { icon: any; label: string; onPress: () => void; danger?: boolean }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={styles.sheetItem}>
      <Ionicons name={icon} size={20} color={danger ? theme.danger : theme.text} />
      <Text style={{ color: danger ? theme.danger : theme.text, marginLeft: 12, fontSize: 15, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  circleTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  dots: { padding: 6 },
  image: { width: '100%', aspectRatio: 16 / 10, borderRadius: 14, marginTop: 12, borderWidth: 1 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, gap: 16 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 12, fontWeight: '600' },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { padding: 14, paddingBottom: 30, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, gap: 4 },
  sheetItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
});

export default PostCard;
