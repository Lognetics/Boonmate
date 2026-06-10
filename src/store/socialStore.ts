import { create } from 'zustand';
import {
  posts as seedPosts,
  chats as seedChats,
  events as seedEvents,
  circles as seedCircles,
  notifications as seedNotifications,
  liveStreams as seedLiveStreams,
  ME_ID,
  users as seedUsers,
} from '@/services/mockData';
import type { BoonEvent, ChatThread, Circle, LiveAudience, LiveStream, Message, Notification, Post, User } from '@/utils/types';
import { firebaseEnabled } from '@/services/firebase';
import {
  subscribePosts,
  subscribeCircles,
  subscribeChats,
  subscribeMessages,
  createPost,
  toggleLikePost,
  deletePostDoc,
  setCircleMembership,
  ensureChat,
  sendChatMessage,
} from '@/services/firestore';
import { useAuthStore } from './authStore';

interface SocialState {
  posts: Post[];
  chats: ChatThread[];
  events: BoonEvent[];
  circles: Circle[];
  notifications: Notification[];
  users: User[];
  liveStreams: LiveStream[];
  myLiveId?: string;

  // lifecycle
  attachRemote: () => () => void;

  // posts
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  deletePost: (id: string) => void;
  addPost: (text: string, image?: string, circleId?: string) => Promise<void>;

  // circles
  setCircleJoined: (id: string, joined: boolean) => Promise<void>;

  // events
  toggleAttending: (id: string) => void;
  addEvent: (e: Omit<BoonEvent, 'id' | 'going' | 'attending' | 'past'>) => void;

  // chat
  sendMessage: (chatId: string, text: string) => Promise<void>;
  markChatRead: (chatId: string) => void;
  startChat: (userId: string) => Promise<string>;
  attachChatMessages: (chatId: string) => () => void;

  // people
  toggleConnect: (id: string) => void;

  // notifications
  markAllNotificationsRead: () => void;

  // live
  startLive: (title: string, audience: LiveAudience, circleId?: string) => string;
  endLive: () => void;
  bumpLiveViewers: (id: string, delta: number) => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  posts: seedPosts,
  chats: seedChats,
  events: seedEvents,
  circles: seedCircles,
  notifications: seedNotifications,
  users: seedUsers,
  liveStreams: seedLiveStreams,
  myLiveId: undefined,

  attachRemote() {
    if (!firebaseEnabled()) return () => {};
    const uid = useAuthStore.getState().user.id;
    const offPosts = subscribePosts((posts) => {
      if (posts.length) set({ posts });
    });
    const offCircles = subscribeCircles((circles) => {
      if (circles.length) set({ circles });
    });
    const offChats = uid && uid !== 'me' ? subscribeChats(uid, (chats) => set({ chats })) : () => {};
    return () => {
      offPosts();
      offCircles();
      offChats();
    };
  },

  toggleLike(id) {
    const post = get().posts.find((p) => p.id === id);
    if (!post) return;
    set({
      posts: get().posts.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p,
      ),
    });
    if (firebaseEnabled()) {
      const uid = useAuthStore.getState().user.id;
      toggleLikePost(id, uid, !!post.liked).catch(() => {});
    }
  },
  toggleSave(id) {
    set({ posts: get().posts.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)) });
  },
  deletePost(id) {
    set({ posts: get().posts.filter((p) => p.id !== id) });
    if (firebaseEnabled()) deletePostDoc(id).catch(() => {});
  },
  async addPost(text, image, circleId) {
    const me = useAuthStore.getState().user;
    const circle = circleId ? get().circles.find((c) => c.id === circleId) : undefined;
    const newPost: Post = {
      id: `p_${Date.now()}`,
      authorId: me.id,
      authorName: me.name,
      authorAvatar: me.avatar,
      createdAt: new Date().toISOString(),
      text,
      image,
      likes: 0,
      comments: 0,
      circleId,
      circleName: circle?.name,
    };
    set({ posts: [newPost, ...get().posts] });
    if (firebaseEnabled() && me.id !== 'me') {
      try {
        await createPost(me.id, {
          authorId: me.id,
          authorName: me.name,
          authorAvatar: me.avatar,
          text,
          image,
          circleId,
          circleName: circle?.name,
        });
      } catch (e) {
        // keep optimistic copy; surface elsewhere
      }
    }
  },

  async setCircleJoined(id, joined) {
    const current = get().circles.find((c) => c.id === id);
    if (!current) return;
    set({
      circles: get().circles.map((c) =>
        c.id === id ? { ...c, joined, members: c.members + (joined && !c.joined ? 1 : !joined && c.joined ? -1 : 0) } : c,
      ),
    });
    if (firebaseEnabled()) {
      const uid = useAuthStore.getState().user.id;
      if (uid && uid !== 'me') {
        await setCircleMembership(id, uid, joined).catch(() => {});
      }
    }
  },

  toggleAttending(id) {
    set({
      events: get().events.map((e) =>
        e.id === id ? { ...e, attending: !e.attending, going: e.going + (e.attending ? -1 : 1) } : e,
      ),
    });
  },
  addEvent(e) {
    const newE: BoonEvent = { ...e, id: `e_${Date.now()}`, going: 1, attending: true };
    set({ events: [newE, ...get().events] });
  },

  async sendMessage(chatId, text) {
    const me = useAuthStore.getState().user;
    const msg: Message = { id: `m_${Date.now()}`, fromId: me.id, text, at: new Date().toISOString() };
    set({
      chats: get().chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, msg], preview: text, at: msg.at } : c,
      ),
    });
    if (firebaseEnabled() && me.id !== 'me') {
      await sendChatMessage(chatId, me.id, text).catch(() => {});
    }
  },
  markChatRead(chatId) {
    set({ chats: get().chats.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)) });
  },
  async startChat(userId) {
    const exists = get().chats.find((c) => c.withUserId === userId);
    if (exists) return exists.id;
    let id = `c_${userId}`;
    if (firebaseEnabled()) {
      const me = useAuthStore.getState().user;
      if (me.id !== 'me') id = await ensureChat(me.id, userId);
    }
    const newChat: ChatThread = {
      id,
      withUserId: userId,
      preview: '',
      at: new Date().toISOString(),
      messages: [],
    };
    set({ chats: [newChat, ...get().chats] });
    return id;
  },
  attachChatMessages(chatId) {
    if (!firebaseEnabled()) return () => {};
    const off = subscribeMessages(chatId, (messages) => {
      set({
        chats: get().chats.map((c) => (c.id === chatId ? { ...c, messages, preview: messages[messages.length - 1]?.text ?? c.preview } : c)),
      });
    });
    return off;
  },

  toggleConnect(id) {
    set({
      users: get().users.map((u) => (u.id === id ? { ...u, connected: !u.connected } : u)),
    });
  },

  markAllNotificationsRead() {
    set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) });
  },

  startLive(title, audience, circleId) {
    const me = useAuthStore.getState().user;
    const id = `live_${Date.now()}`;
    const stream: LiveStream = {
      id,
      hostId: me.id,
      hostName: me.name,
      hostAvatar: me.avatar,
      title,
      viewers: 1,
      startedAt: new Date().toISOString(),
      audience,
      circleId,
      isMine: true,
    };
    set({ liveStreams: [stream, ...get().liveStreams], myLiveId: id });
    return id;
  },
  endLive() {
    const myId = get().myLiveId;
    if (!myId) return;
    set({ liveStreams: get().liveStreams.filter((s) => s.id !== myId), myLiveId: undefined });
  },
  bumpLiveViewers(id, delta) {
    set({
      liveStreams: get().liveStreams.map((s) =>
        s.id === id ? { ...s, viewers: Math.max(0, s.viewers + delta) } : s,
      ),
    });
  },
}));
