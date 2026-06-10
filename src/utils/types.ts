import type { BadgeKind } from '@/components/BadgePill';

export type Status = 'Available' | 'Busy' | 'Away' | 'Working';
export type Intent = 'friends' | 'network' | 'explore';
export type Plan = 'free' | 'basic' | 'plus' | 'pro';

export interface User {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  interests: string[];
  circles: string[];
  status: Status;
  mutualConnections?: number;
  badges?: BadgeKind[];
  online?: boolean;
  connected?: boolean;
  language?: string;
  neurodivergent?: boolean;
  plan?: Plan;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  rules?: string[];
  notice?: string;
  consentTone?: 'default' | 'surrogacy' | 'sensitive';
  premium?: boolean;
  joined?: boolean;
  emoji?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  circleId?: string;
  circleName?: string;
  createdAt: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
}

export type EventCategory =
  | 'Hangout'
  | 'Workshop'
  | 'Meetup'
  | 'Outdoor'
  | 'Sports'
  | 'Support Group'
  | 'Networking'
  | 'Wellness'
  | 'Gaming'
  | 'Other';

export interface BoonEvent {
  id: string;
  title: string;
  category: EventCategory;
  emoji: string;
  date: string;
  time: string;
  location: string;
  going: number;
  attending?: boolean;
  description?: string;
  organizerId?: string;
  past?: boolean;
}

export interface Message {
  id: string;
  fromId: string;
  text: string;
  at: string;
  read?: boolean;
}

export interface ChatThread {
  id: string;
  withUserId: string;
  preview: string;
  unread?: number;
  at: string;
  messages: Message[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read?: boolean;
  kind: 'connect' | 'event' | 'circle' | 'message' | 'ai';
}

export interface Therapist {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  specialties: string[];
  location?: string;
  contact: { phone?: string; email?: string; demoUrl?: string };
  availability: 'Available' | 'Away' | 'Booked';
  rating: number;
  verified: true;
}

export interface Institution {
  id: string;
  name: string;
  location: string;
  description: string;
  contact: { phone?: string; email?: string; website?: string };
}

export type LiveAudience = 'public' | 'followers' | 'circle';

export interface LiveStream {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  title: string;
  thumbnail?: string;
  viewers: number;
  startedAt: string;
  audience: LiveAudience;
  circleId?: string;
  isMine?: boolean;
}

export interface LiveComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  at: string;
  reaction?: '❤️' | '👏' | '🔥' | '✨' | '💜';
}
