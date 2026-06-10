import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeContext';
import GradientButton from '@/components/GradientButton';
import Chip from '@/components/Chip';
import Avatar from '@/components/Avatar';
import { useAuthStore } from '@/store/authStore';
import { useSocialStore } from '@/store/socialStore';
import { firebaseEnabled, uploadImageToStorage } from '@/services/firebase';

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const initialCircleId = route.params?.circleId as string | undefined;
  const user = useAuthStore((s) => s.user);
  const circles = useSocialStore((s) => s.circles).filter((c) => c.joined || ['neuro', 'friendship', 'tech'].includes(c.id));
  const addPost = useSocialStore((s) => s.addPost);
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [circleId, setCircleId] = useState<string | undefined>(initialCircleId);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to attach images.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.canceled && res.assets[0]) setImage(res.assets[0].uri);
  };

  const [posting, setPosting] = useState(false);
  const submit = async () => {
    if (!text.trim() && !image) return;
    setPosting(true);
    try {
      let imageUrl = image;
      if (firebaseEnabled() && image && image.startsWith('file:') && user.id !== 'me') {
        imageUrl = await uploadImageToStorage(image, `posts/${user.id}/${Date.now()}.jpg`);
      }
      await addPost(text.trim(), imageUrl, circleId);
      nav.goBack();
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="close" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontWeight: '800', fontSize: 17 }}>Create Post</Text>
        <GradientButton title="Post" onPress={submit} size="sm" loading={posting} disabled={!text.trim() && !image} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View style={styles.row}>
          <Avatar uri={user.avatar} name={user.name} size={44} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: theme.text, fontWeight: '800' }}>{user.name}</Text>
            <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="people-outline" size={12} color={theme.textMuted} />
              <Text style={{ color: theme.textMuted, fontSize: 12, marginLeft: 4 }}>
                {circleId ? circles.find((c) => c.id === circleId)?.name : 'Public to your followers'}
              </Text>
            </View>
          </View>
        </View>

        <TextInput
          multiline
          autoFocus
          value={text}
          onChangeText={setText}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.textMuted}
          style={{ minHeight: 120, color: theme.text, fontSize: 16, marginTop: 16, textAlignVertical: 'top' }}
        />

        {image ? (
          <View style={{ marginTop: 10 }}>
            <Image source={{ uri: image }} style={[styles.preview, { borderColor: theme.border }]} />
            <TouchableOpacity onPress={() => setImage(undefined)} style={[styles.removeBtn, { backgroundColor: theme.card }]}>
              <Ionicons name="close" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={{ color: theme.textMuted, marginTop: 24, marginBottom: 8 }}>Post to a circle (optional)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Public" selected={!circleId} onPress={() => setCircleId(undefined)} />
            {circles.map((c) => (
              <Chip key={c.id} label={`${c.emoji ?? '⭕'} ${c.name}`} selected={circleId === c.id} onPress={() => setCircleId(c.id)} />
            ))}
          </View>
        </ScrollView>

        <View style={[styles.actions, { borderColor: theme.border }]}>
          <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
            <Ionicons name="image-outline" size={22} color={theme.primary} />
            <Text style={{ color: theme.text, marginLeft: 8 }}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  preview: { width: '100%', aspectRatio: 16 / 10, borderRadius: 14, borderWidth: 1 },
  removeBtn: { position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actions: { borderTopWidth: 1, marginTop: 24, paddingTop: 16, flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
});
