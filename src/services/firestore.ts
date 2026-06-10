import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
  where,
  limit,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { ChatThread, Circle, Message, Post, User } from '@/utils/types';

const COL = {
  users: 'users',
  posts: 'posts',
  circles: 'circles',
  events: 'events',
  chats: 'chats',
  notifications: 'notifications',
} as const;

const tsToIso = (v: any): string => {
  if (!v) return new Date().toISOString();
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (typeof v === 'string') return v;
  if (v.seconds) return new Date(v.seconds * 1000).toISOString();
  return new Date().toISOString();
};

// ---------- USERS ----------
export async function getUserDoc(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db(), COL.users, uid));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<User, 'id'>) }) : null;
}

export async function upsertUser(uid: string, data: Partial<User>) {
  await setDoc(doc(db(), COL.users, uid), { ...data, id: uid, updatedAt: serverTimestamp() }, { merge: true });
}

export async function listUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db(), COL.users));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<User, 'id'>) }));
}

// ---------- POSTS ----------
export function subscribePosts(cb: (posts: Post[]) => void): Unsubscribe {
  const q = query(collection(db(), COL.posts), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) => {
    const posts: Post[] = snap.docs.map((d) => {
      const data = d.data() as any;
      return { ...data, id: d.id, createdAt: tsToIso(data.createdAt) } as Post;
    });
    cb(posts);
  });
}

export async function createPost(uid: string, p: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) {
  await addDoc(collection(db(), COL.posts), {
    ...p,
    authorId: uid,
    likes: 0,
    comments: 0,
    createdAt: serverTimestamp(),
  });
}

export async function toggleLikePost(postId: string, uid: string, currentlyLiked: boolean) {
  await updateDoc(doc(db(), COL.posts, postId), {
    likes: increment(currentlyLiked ? -1 : 1),
    likedBy: currentlyLiked ? arrayRemove(uid) : arrayUnion(uid),
  });
}

export async function deletePostDoc(postId: string) {
  await deleteDoc(doc(db(), COL.posts, postId));
}

// ---------- CIRCLES ----------
export function subscribeCircles(cb: (circles: Circle[]) => void): Unsubscribe {
  return onSnapshot(collection(db(), COL.circles), (snap) => {
    const circles: Circle[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Circle, 'id'>) }));
    cb(circles);
  });
}

export async function setCircleMembership(circleId: string, uid: string, joined: boolean) {
  await updateDoc(doc(db(), COL.circles, circleId), {
    members: increment(joined ? 1 : -1),
    memberIds: joined ? arrayUnion(uid) : arrayRemove(uid),
  });
}

// ---------- CHATS ----------
export async function ensureChat(meId: string, otherId: string): Promise<string> {
  const chatId = [meId, otherId].sort().join('_');
  await setDoc(
    doc(db(), COL.chats, chatId),
    { participantIds: [meId, otherId], updatedAt: serverTimestamp() },
    { merge: true },
  );
  return chatId;
}

export function subscribeChats(meId: string, cb: (chats: ChatThread[]) => void): Unsubscribe {
  const q = query(collection(db(), COL.chats), where('participantIds', 'array-contains', meId));
  return onSnapshot(q, (snap) => {
    const chats: ChatThread[] = snap.docs.map((d) => {
      const data = d.data() as any;
      const other = (data.participantIds ?? []).find((id: string) => id !== meId) ?? '';
      return {
        id: d.id,
        withUserId: other,
        preview: data.preview ?? '',
        at: tsToIso(data.updatedAt),
        unread: data.unread?.[meId] ?? 0,
        messages: [],
      };
    });
    cb(chats);
  });
}

export function subscribeMessages(chatId: string, cb: (msgs: Message[]) => void): Unsubscribe {
  const q = query(collection(db(), COL.chats, chatId, 'messages'), orderBy('at', 'asc'), limit(200));
  return onSnapshot(q, (snap) => {
    const msgs: Message[] = snap.docs.map((d) => {
      const data = d.data() as any;
      return { id: d.id, fromId: data.fromId, text: data.text, at: tsToIso(data.at), read: !!data.read };
    });
    cb(msgs);
  });
}

export async function sendChatMessage(chatId: string, fromId: string, text: string) {
  const messagesRef = collection(db(), COL.chats, chatId, 'messages');
  await addDoc(messagesRef, { fromId, text, at: serverTimestamp() });
  await updateDoc(doc(db(), COL.chats, chatId), { preview: text, updatedAt: serverTimestamp() });
}

// ---------- BATCH SEED ----------
export async function batchWriteUsers(users: User[]) {
  const batch = writeBatch(db());
  users.forEach((u) => batch.set(doc(db(), COL.users, u.id), u, { merge: true }));
  await batch.commit();
}
export async function batchWriteCircles(circles: Circle[]) {
  const batch = writeBatch(db());
  circles.forEach((c) => batch.set(doc(db(), COL.circles, c.id), c, { merge: true }));
  await batch.commit();
}
export async function batchWritePosts(posts: Post[]) {
  const batch = writeBatch(db());
  posts.forEach((p) => {
    const ref = doc(db(), COL.posts, p.id);
    batch.set(ref, { ...p, createdAt: Timestamp.fromDate(new Date(p.createdAt)) }, { merge: true });
  });
  await batch.commit();
}
