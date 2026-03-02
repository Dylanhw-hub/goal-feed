export interface Character {
  id: string
  name: string
  handle: string
  gradient: [string, string]
  emoji: string
}

export const characters: Record<string, Character> = {
  thando: {
    id: 'thando',
    name: 'Thando',
    handle: '@thando_vibes',
    gradient: ['#f59e0b', '#ef4444'],
    emoji: '🔥',
  },
  rea: {
    id: 'rea',
    name: 'Rea',
    handle: '@rea.plans',
    gradient: ['#10b981', '#3b82f6'],
    emoji: '📋',
  },
  sipho: {
    id: 'sipho',
    name: 'Sipho',
    handle: '@sipho_says',
    gradient: ['#8b5cf6', '#ec4899'],
    emoji: '🤔',
  },
  naledi: {
    id: 'naledi',
    name: 'Naledi',
    handle: '@naledi.writes',
    gradient: ['#ec4899', '#f59e0b'],
    emoji: '✨',
  },
  jay: {
    id: 'jay',
    name: 'Jay',
    handle: '@jay_real_talk',
    gradient: ['#3b82f6', '#8b5cf6'],
    emoji: '💯',
  },
}

export type PostType = 'status' | 'poll' | 'debate' | 'beforeAfter' | 'create'

export interface StatusPostData {
  type: 'status'
  id: string
  characterId: string
  text: string
  timeAgo: string
  likes: number
  comments: number
}

export interface PollPostData {
  type: 'poll'
  id: string
  characterId: string
  question: string
  options: [string, string]
  correctIndex: number
  explanation: string
  timeAgo: string
  totalVotes: number
}

export interface DebatePostData {
  type: 'debate'
  id: string
  characterId: string
  hotTake: string
  timeAgo: string
  replies: {
    characterId: string
    text: string
    isCorrect: boolean
  }[]
  explanation: string
}

export interface BeforeAfterPostData {
  type: 'beforeAfter'
  id: string
  characterId: string
  before: string
  after: string
  timeAgo: string
  isPositive: boolean
  label: string
}

export interface CreatePostData {
  type: 'create'
  id: string
}

export type FeedPost = StatusPostData | PollPostData | DebatePostData | BeforeAfterPostData | CreatePostData

export interface StorySlide {
  title: string
  text: string
  emoji: string
  bg: [string, string]
}

export interface StoryData {
  id: string
  label: string
  characterId: string
  slides: StorySlide[]
}

export const stories: StoryData[] = [
  {
    id: 'story-intro',
    label: 'What makes goals work?',
    characterId: 'rea',
    slides: [
      {
        title: 'Most goals fail.',
        text: 'Not because people are lazy — but because the goal itself was set up wrong.',
        emoji: '😬',
        bg: ['#7c3aed', '#4f46e5'],
      },
      {
        title: 'Vague = doomed',
        text: '"Study more" and "try harder" feel motivating but give your brain nothing to act on.',
        emoji: '🫠',
        bg: ['#dc2626', '#f59e0b'],
      },
      {
        title: 'Specific = powerful',
        text: 'The best goals answer: WHAT exactly? HOW OFTEN? BY WHEN? WHO can help?',
        emoji: '🎯',
        bg: ['#059669', '#10b981'],
      },
      {
        title: 'Watch the feed.',
        text: 'See which students\' goals actually work — and which ones stay wishes.',
        emoji: '👀',
        bg: ['#7c3aed', '#ec4899'],
      },
    ],
  },
  {
    id: 'story-recap',
    label: 'Build your goal',
    characterId: 'naledi',
    slides: [
      {
        title: 'Quick recap',
        text: 'You\'ve seen what works and what doesn\'t. Now it\'s your turn.',
        emoji: '📝',
        bg: ['#7c3aed', '#4f46e5'],
      },
      {
        title: 'Be specific',
        text: 'Say exactly what you\'ll do. "Practice 5 problems" beats "study more."',
        emoji: '🎯',
        bg: ['#059669', '#10b981'],
      },
      {
        title: 'Set a deadline',
        text: 'Without a finish line, good intentions fade. Pick a date.',
        emoji: '📅',
        bg: ['#dc2626', '#f59e0b'],
      },
      {
        title: 'Know your why',
        text: 'When it gets hard, your reason keeps you going. Write it down.',
        emoji: '💪',
        bg: ['#ec4899', '#7c3aed'],
      },
    ],
  },
]

export const feedPosts: FeedPost[] = [
  // 1. Thando's vague goal
  {
    type: 'status',
    id: 'post-1',
    characterId: 'thando',
    text: 'New term energy!! I\'m going to study SO much harder this term 💪💪 No more messing around. This is MY term fr fr',
    timeAgo: '2h',
    likes: 24,
    comments: 8,
  },
  // 2. Rea's specific goal
  {
    type: 'status',
    id: 'post-2',
    characterId: 'rea',
    text: 'My Term 2 plan:\n📌 Do 2 past papers every weekend\n📌 Review mistakes with Mr D on Mondays\n📌 Target: 65% or higher by June exams\n\nPosting this so I can\'t back out 😅',
    timeAgo: '1h',
    likes: 47,
    comments: 12,
  },
  // 3. Poll: whose goal works better?
  {
    type: 'poll',
    id: 'post-3',
    characterId: 'rea',
    question: 'Be honest — whose goal is more likely to actually work?',
    options: ['Thando\'s: "Study SO much harder"', 'Rea\'s: Specific plan with deadlines'],
    correctIndex: 1,
    explanation: 'Rea\'s goal works because it\'s specific — she knows WHAT to do (past papers), WHEN (weekends), and WHO helps (Mr D). Thando\'s energy is great but "study harder" doesn\'t tell your brain what to actually do.',
    timeAgo: '45m',
    totalVotes: 2847,
  },
  // 4. Thando's before/after
  {
    type: 'beforeAfter',
    id: 'post-4',
    characterId: 'thando',
    before: '"I\'m going to study SO much harder this term" 💪',
    after: 'Week 4: Haven\'t started yet. Keep saying "I\'ll start Monday." It\'s Thursday. 😭',
    timeAgo: '5w later',
    isPositive: false,
    label: '5 weeks later...',
  },
  // 5. Rea's before/after
  {
    type: 'beforeAfter',
    id: 'post-5',
    characterId: 'rea',
    before: '"2 past papers every weekend, review with Mr D on Mondays, target 65% by June"',
    after: 'June results: 67%!! 🎉 The weekly reviews honestly saved me. Mr D caught mistakes I kept making.',
    timeAgo: 'June',
    isPositive: true,
    label: 'June exam results',
  },
  // 6. Sipho's hot take on deadlines
  {
    type: 'debate',
    id: 'post-6',
    characterId: 'sipho',
    hotTake: 'Hot take: Deadlines are just pointless pressure. You should study when you actually feel like it, not because some date says so. Forced studying = wasted time.',
    timeAgo: '3h',
    replies: [
      {
        characterId: 'jay',
        text: 'Bro "when you feel like it" means never 😂 Deadlines aren\'t pressure — they\'re commitment points. Without them you just keep saying "next week."',
        isCorrect: true,
      },
      {
        characterId: 'thando',
        text: 'Sipho\'s got a point though. I hate feeling rushed. Studying should feel natural.',
        isCorrect: false,
      },
      {
        characterId: 'naledi',
        text: 'Deadlines aren\'t about pressure — they give you a finish line. "Read 1 novel by May" actually happens. "Read more books" never does.',
        isCorrect: true,
      },
    ],
    explanation: 'Without a deadline, good intentions slide into "I\'ll start next week" forever. Deadlines create commitment — not pressure. They turn wishes into plans with a finish line.',
  },
  // 7. Poll: deadline comparison
  {
    type: 'poll',
    id: 'post-7',
    characterId: 'naledi',
    question: 'Two students want to improve in English.\n\nStudent A: "I\'ll read more books."\nStudent B: "I\'ll read 1 novel by end of May and write a one-page response."\n\nWho improves more?',
    options: ['Student A — no pressure = more enjoyment', 'Student B — the deadline makes it real'],
    correctIndex: 1,
    explanation: 'Student B wins. The deadline + deliverable ("write a one-page response") create a commitment point. Student A\'s goal has no finish line — it slides into "I\'ll start next month" forever.',
    timeAgo: '2h',
    totalVotes: 1923,
  },
  // 8. Naledi on "why it matters"
  {
    type: 'status',
    id: 'post-8',
    characterId: 'naledi',
    text: 'Real talk: I almost quit studying for Science last month. What kept me going? I wrote down WHY I want to pass — to be the first in my family to study engineering.\n\nWhen it got hard, I re-read that. It hit different.\n\nWrite down your WHY. Trust me. ✍️',
    timeAgo: '4h',
    likes: 156,
    comments: 34,
  },
  // 9. Jay's hot take on "why"
  {
    type: 'debate',
    id: 'post-9',
    characterId: 'jay',
    hotTake: 'Unpopular opinion: Knowing your "why" is overrated. Just do the work. You don\'t need to feel motivated to study — you just need discipline. Feelings don\'t pass exams.',
    timeAgo: '1h',
    replies: [
      {
        characterId: 'naledi',
        text: 'Discipline is real but it runs out too. Your "why" is what refills it. When you\'re exhausted at 10pm and want to quit, "I\'m doing this for my family" hits harder than "just be disciplined."',
        isCorrect: true,
      },
      {
        characterId: 'sipho',
        text: 'Jay\'s right. Stop overthinking and just study. All this "find your why" stuff is procrastination with extra steps.',
        isCorrect: false,
      },
      {
        characterId: 'rea',
        text: 'You need both. Discipline gets you started. Your "why" keeps you going when discipline isn\'t enough. They\'re not opposites.',
        isCorrect: true,
      },
    ],
    explanation: 'Discipline matters — but it\'s not infinite. Your personal "why" is what recharges it. Research shows students who write down WHY a goal matters are significantly more likely to follow through. The best approach combines discipline WITH personal meaning.',
  },
  // 10. Create your own
  {
    type: 'create',
    id: 'post-create',
  },
]
