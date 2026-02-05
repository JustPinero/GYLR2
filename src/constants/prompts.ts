import { JudgePersonality, TimeAllocation, TimePeriod, Category } from '../types';
import { formatHoursFromMinutes } from '../utils/timeCalculations';

// System prompts for each personality
const SYSTEM_PROMPTS: Record<JudgePersonality, string> = {
  sarcastic_friend: `You are a sarcastic friend who loves to playfully roast your buddy about their life choices. You're supportive deep down but can't resist making jokes. Keep it light and fun - tease, don't hurt.

Rules:
- Keep responses to 2-3 sentences max
- Reference specific percentages when funny
- If something is at 0%, definitely mention it
- Be witty, not mean-spirited
- Use casual, conversational language
- Don't use hashtags or emojis`,

  cruel_comedian: `You are a brutal stand-up comedian roasting an audience member about their life priorities. No filter, no mercy - but keep it clever, not crude. Think roast battle, not bullying.

Rules:
- 2-3 sentences max
- Go for the jugular on imbalances
- Zero percentages are comedy gold
- Be savage but smart
- No profanity, just wit
- Don't use hashtags or emojis`,

  disappointed_parent: `You are a disappointed parent reviewing your adult child's time management. Heavy sighs, guilt trips, and passive-aggressive concern. You're not angry, just... disappointed.

Rules:
- 2-3 sentences max
- Use phrases like "I'm not mad, but..." or "When I was your age..."
- Express concern that masks judgment
- Mention what they SHOULD be doing
- Subtle guilt trips are your specialty
- Don't use hashtags or emojis`,
};

// Time period labels for natural language
const PERIOD_LABELS: Record<TimePeriod, string> = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  year: 'this year',
};

// Category labels for display
const CATEGORY_LABELS: Record<Category, string> = {
  [Category.WORK]: 'Work',
  [Category.PLAY]: 'Play',
  [Category.HEALTH]: 'Health',
  [Category.ROMANCE]: 'Romance',
  [Category.STUDY]: 'Study',
  [Category.UNCATEGORIZED]: 'Uncategorized',
};

// Format allocations into readable text for the prompt
function formatAllocationsForPrompt(
  allocations: TimeAllocation[],
  timePeriod: TimePeriod,
  totalMinutes: number
): string {
  // Get all main categories (excluding uncategorized)
  const mainCategories: Category[] = [
    Category.WORK,
    Category.PLAY,
    Category.HEALTH,
    Category.ROMANCE,
    Category.STUDY,
  ];

  // Build allocation lines
  const lines = mainCategories.map((category) => {
    const allocation = allocations.find((a) => a.category === category);
    const percentage = allocation?.percentage ?? 0;
    const minutes = allocation?.totalMinutes ?? 0;
    const hours = formatHoursFromMinutes(minutes);
    return `- ${CATEGORY_LABELS[category]}: ${percentage}% (${hours})`;
  });

  const totalHours = formatHoursFromMinutes(totalMinutes);

  return `Here's how I spent my time ${PERIOD_LABELS[timePeriod]}:
${lines.join('\n')}

Total tracked: ${totalHours}

Give me a quick roast about this distribution.`;
}

// Build complete prompt for Claude API
export function buildPrompt(
  personality: JudgePersonality,
  allocations: TimeAllocation[],
  timePeriod: TimePeriod,
  totalMinutes: number
): { systemPrompt: string; userPrompt: string } {
  return {
    systemPrompt: SYSTEM_PROMPTS[personality],
    userPrompt: formatAllocationsForPrompt(allocations, timePeriod, totalMinutes),
  };
}

// Get personality display info
export function getPersonalityInfo(personality: JudgePersonality): {
  name: string;
  icon: string;
  description: string;
} {
  const info: Record<JudgePersonality, { name: string; icon: string; description: string }> = {
    sarcastic_friend: {
      name: 'Sarcastic Friend',
      icon: '😏',
      description: 'Playful teasing with love',
    },
    cruel_comedian: {
      name: 'Cruel Comedian',
      icon: '🎭',
      description: 'No filter, maximum roast',
    },
    disappointed_parent: {
      name: 'Disappointed Parent',
      icon: '😔',
      description: 'Guilt trips and heavy sighs',
    },
  };

  return info[personality];
}

// Loading messages to display while waiting for API
export const LOADING_MESSAGES: string[] = [
  'Analyzing your life choices...',
  'Preparing maximum judgment...',
  'Loading brutal honesty...',
  'Consulting the sass oracle...',
  'Calculating disappointment levels...',
  'Generating premium roast...',
  'Judging intensifies...',
  'Processing your questionable decisions...',
];

// Get a random loading message
export function getRandomLoadingMessage(): string {
  const index = Math.floor(Math.random() * LOADING_MESSAGES.length);
  return LOADING_MESSAGES[index] ?? LOADING_MESSAGES[0]!;
}
