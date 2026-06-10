import { users, circles, posts } from './mockData';
import { batchWriteUsers, batchWriteCircles, batchWritePosts, upsertUser } from './firestore';
import type { User } from '@/utils/types';

export interface SeedReport {
  users: number;
  circles: number;
  posts: number;
}

export async function seedDemoData(currentUser?: Partial<User> & { id: string }): Promise<SeedReport> {
  const me: User | null = currentUser
    ? {
        name: 'You',
        bio: '',
        location: '',
        interests: [],
        circles: [],
        status: 'Available' as const,
        badges: ['Connector' as const, 'Explorer' as const],
        plan: 'pro' as const,
        ...currentUser,
        id: currentUser.id,
      }
    : null;

  const allUsers = me ? [...users, me] : users;
  await batchWriteUsers(allUsers);
  await batchWriteCircles(circles);

  const postsForSeed = me ? posts.map((p) => (p.authorId === 'me' ? { ...p, authorId: me.id, authorName: me.name } : p)) : posts;
  await batchWritePosts(postsForSeed);

  if (me) await upsertUser(me.id, me);

  return { users: allUsers.length, circles: circles.length, posts: postsForSeed.length };
}
