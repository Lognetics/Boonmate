import { aiTopicReplies, dailyInsights } from './mockData';

export interface BoonReply {
  text: string;
  followups?: string[];
}

const SCRIPTED: { match: RegExp; reply: BoonReply }[] = [
  {
    match: /lonel/i,
    reply: {
      text:
        "Loneliness is one of the realest human feelings — and it doesn't mean anything is wrong with you. Two things that help in my experience: tiny rituals (a coffee walk twice a week, even alone) and one tiny ping a day to a person. Want me to suggest a person from your circles?",
      followups: ['Suggest someone', 'How do I start a tiny ritual?', 'Just want to vent'],
    },
  },
  {
    match: /friend|adult/i,
    reply: {
      text:
        "Adult friendship is built on three things: proximity (you have to share space), frequency (you have to repeat), and vulnerability (one of you has to go first). Pick one circle near you, show up twice, and message one person after. That's the whole recipe.",
      followups: ['Pick a circle for me', 'I get nervous messaging', 'Show me events this week'],
    },
  },
  {
    match: /relationship|partner/i,
    reply: {
      text:
        "Healthy relationships repeat four moves: name the feeling, take the bid, repair fast, celebrate often. Which of these feels hardest right now?",
      followups: ['Name the feeling', 'Take the bid', 'Repair fast', 'Celebrate often'],
    },
  },
  {
    match: /confidence/i,
    reply: {
      text:
        "Confidence is just evidence over time that you keep your promises to yourself. So we start small: one promise today, in writing. Want to draft one together?",
      followups: ['Help me draft one', 'I keep breaking them', 'Why is this so hard?'],
    },
  },
  {
    match: /wellness|sleep|stress/i,
    reply: {
      text:
        "Tiny wellness wins more than any 30-day reset. Try this for the next 24 hours: water before coffee, sun before screens, and one walk without your phone. Report back tomorrow.",
      followups: ['Why phone-free?', 'I can\'t do sun', 'Give me a 5-min version'],
    },
  },
  {
    match: /growth/i,
    reply: {
      text:
        "Growth needs friction + reflection. Pick one slightly uncomfortable thing this week, and one 5-minute journal afterwards. Want a prompt?",
      followups: ['Give me a prompt', 'Pick the uncomfortable thing', 'What if I fail?'],
    },
  },
  {
    match: /co.?parent/i,
    reply: {
      text:
        "Co-parenting works best when the relationship becomes a project, not a feeling. Shared docs > shared moods. Want a starter template for week-to-week planning?",
      followups: ['Yes, template please', "We're not on speaking terms", 'My ex is unpredictable'],
    },
  },
  {
    match: /conversation/i,
    reply: {
      text:
        "The single best move in any conversation: ask the second question. Their answer is the door — the second question is the room. Want to practice a few?",
      followups: ['Yes, practice with me', 'I freeze up', 'Give me openers'],
    },
  },
];

export async function boonReply(input: string): Promise<BoonReply> {
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 700));
  for (const item of SCRIPTED) {
    if (item.match.test(input)) return item.reply;
  }
  const generic = aiTopicReplies(input)[0]!;
  return { text: generic, followups: ['Tell me more', 'Give me an action', 'Just listen'] };
}

export function dailyInsight() {
  return dailyInsights[Math.floor(Math.random() * dailyInsights.length)]!;
}
