# Boonmate — Human Connection OS

A comprehensive React Native + Expo mobile app focused on real-world friendship, community, and human connection. Built as a fully navigable scaffold with mock data — Firebase-ready when you plug in your keys.

## ✨ Features

### Core
- **5-tab navigation** — Home, Connect, Events, Chat, Me
- **Dark / Light mode** — instant toggle from Home and Profile, persisted in storage
- **Full onboarding flow** — 10 steps (Welcome → Language → SignUp → Profile → Personality → LifeStage → Interests → Intent → LookingFor → Availability → Circles → Notifications)
- **15-language i18n** with RTL support for Arabic (English, French, Arabic, Chinese, Spanish, Portuguese, Hindi, German, Japanese, Korean, Italian, Russian, Turkish, Swahili, Yoruba)

### Social
- **Home feed** with posts, Daily AI Insight widget, suggested users carousel, and Boon AI shortcut
- **Post types** — text, image; like, comment, save, share, 3-dot menu (view profile, mute, report, delete)
- **Create Post** with image picker, circle selector, public option
- **Notifications popover** + dedicated Notifications screen
- **24 circles** — Tech, Fitness, Therapy, Neurodivergent, Friendship Lab, Surrogacy Support, Co-Parenting, and more
- **Community Consent Modal** before every join, with bespoke rules + tone per circle (surrogacy gets a warning notice)
- **Circle detail** screen with circle-specific feed and "New Post" CTA
- **People discovery** with AI suggestions, badges (Connector, Explorer, Creative, Pioneer, Healer, Supporter), Connect / Message actions
- **Full user profile pages** with cover, bio, status, badges, interests, mutual connections, recent posts
- **Events** — list, search, category filter, attending section, filters modal (date range + sort), Create Event, Event Detail with join/leave
- **Chat list** with pinned Boon AI, recent conversations, unread badges, online indicators
- **Chat room** — bubbles with timestamps, quick replies, gradient send button
- **Profile** — About / Circles / Posts / Gallery tabs, avatar picker, gallery picker, edit profile

### AI
- **Boon AI chat** — full conversation engine with scripted topic routing (loneliness, friendship, relationships, confidence, wellness, growth, co-parenting, conversations)
- **Voice in / out** with `expo-speech` text-to-speech and mic UX (locked to Plus/Pro)
- **Suggested topics** grid for first-time users
- **Daily Insight** rotating cards on Home

### Specialized Hubs
- **Neurodiversity Hub** — 5 ND circles seeded, low stimulation mode toggle, optional ND self-identification, 4 resource cards, "Talk to a Specialist" CTA
- **Therapists & Coaches** — 6 verified pros with filters, expandable bios, contact info, crisis disclaimer
- **Surrogacy** — 3 verified institutions only, strong legal disclaimer, no peer-to-peer
- **Growth Hub** — wellness + personal growth cards

### Identity & Monetization
- **Anonymous Mode** — toggle in Settings (Pro plan only, gated)
- **Subscription System** — 4 tiers (Free / Basic $3 / Plus $5 / Pro $10), full upgrade modal, feature gating across the app (voice, premium circles, anonymous mode)
- **Settings** — language, theme, anonymous, neurodiversity mode, low stimulation, subscription, notifications, support, logout

## 🛠 Tech Stack
- React Native (Expo SDK 51)
- TypeScript with `@/` path alias
- React Navigation (native-stack + bottom-tabs)
- Zustand (auth, social, subscription stores)
- i18next + react-i18next
- expo-image-picker, expo-speech, expo-linear-gradient, expo-localization
- Firebase SDK (auth + firestore wrappers, stubbed for demo)

## 📁 Project Structure
```
/
├── App.tsx                     # Theme + i18n + auth gate + nav container
├── app.json                    # Expo config
├── index.ts                    # Entry
├── babel.config.js             # Module resolver alias
├── tsconfig.json               # TS config with @/* alias
└── src/
    ├── components/             # GradientButton, Card, Chip, Avatar, BadgePill,
    │                           # ScreenHeader, PostCard, ConsentModal,
    │                           # NotificationsPopover, Section
    ├── hooks/                  # useT (translation hook)
    ├── i18n/
    │   ├── index.ts            # i18next + RTL setup + persistence
    │   └── locales/            # 15 JSON language files
    ├── navigation/
    │   ├── RootNavigator.tsx   # Auth gate (onboarding vs main)
    │   ├── OnboardingNavigator.tsx
    │   ├── MainTabNavigator.tsx
    │   └── types.ts
    ├── screens/
    │   ├── onboarding/         # 13 screens (Welcome → NotificationsOptIn)
    │   ├── home/               # Home, PostDetail, CreatePost, Notifications
    │   ├── connect/            # Connect, CircleDetail, UserProfile
    │   ├── events/             # Events, CreateEvent, EventDetail
    │   ├── chat/               # ChatList, ChatRoom, BoonAIChat
    │   └── profile/            # Profile, EditProfile, Settings,
    │                           # Subscription, NeurodiversityHub,
    │                           # Therapists, Surrogacy, GrowthHub,
    │                           # LanguagePicker
    ├── services/
    │   ├── firebase.ts         # Auth + Firestore stub (works without keys)
    │   ├── boonAI.ts           # Scripted AI routing
    │   └── mockData.ts         # All seed data — users, posts, circles,
    │                           # events, chats, therapists, institutions
    ├── store/                  # Zustand stores
    │   ├── authStore.ts
    │   ├── socialStore.ts
    │   └── subscriptionStore.ts
    ├── theme/                  # Light + dark themes, ThemeContext
    └── utils/                  # types, time helpers
```

## 🚀 Run

```bash
npm install
npx expo start
```

Press `i` (iOS sim), `a` (Android), or `w` (web).

## 🔐 Firebase (optional)

Drop these into `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```
Without keys, the app uses mock auth + in-memory data — fully functional for demos.

## 🎨 Brand & Tone
- Pink → purple gradient throughout (`#F472B6 → #EC4899 → #A855F7`)
- **NOT a dating app.** Language: "Connect", "Join", "Circle". Never "match", "crush", "date".
- Inclusive, community-driven, non-clinical.

## 🧠 Important Product Rules

- Surrogacy is **institution-only**. Peer-to-peer arrangements are not facilitated.
- Boon AI is **support, not therapy**. Crisis disclaimer present.
- Anonymous Mode is **Pro-only** with a moderation expectation.
- Every circle join goes through a **consent modal** with rules.
- Neurodiversity is **optional self-ID**, never forced labeling.

## 📱 Demo accounts
- Default user: `LOGNETICS` (Pro plan, 7 circles joined, 15 posts)
- Demo chats are pre-seeded with Amara, Marcus, Sofia, Zara

---
Made with 💜 as a complete, navigable scaffold.
