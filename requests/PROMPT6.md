# Phase 6: Claude API Integration

## Overview

This phase integrates the Anthropic Claude API to generate comedic, personalized "roasts" based on the user's time allocation data. The AI will analyze how users spend their time and deliver witty commentary in the style of the selected personality.

---

## Prerequisites

- Phase 5 completed (Life Panel with pie chart and JudgmentCard component)
- Anthropic API key (to be stored securely)
- Types already defined: `JudgmentRequest`, `JudgmentResponse`, `JudgePersonality`

---

## Tasks

### Task 1: Install Anthropic SDK

Install the official Anthropic SDK for making Claude API calls.

```bash
npm install @anthropic-ai/sdk
```

**Note**: For React Native, we'll use the REST API directly since the SDK is primarily for Node.js. We'll create a lightweight wrapper.

---

### Task 2: Create Prompt Templates

Create `src/constants/prompts.ts` with personality-specific prompt templates.

**Requirements:**
- Define system prompts for each personality type
- Include placeholders for time allocation data
- Keep prompts under 500 tokens for efficiency
- Include instructions to keep responses concise (2-3 sentences)

**Personality Definitions:**

| Personality | Tone | Style |
|-------------|------|-------|
| `sarcastic_friend` | Playful, teasing | Like a friend who can't help making jokes |
| `cruel_comedian` | Brutal honesty | Stand-up comedian roast style |
| `disappointed_parent` | Guilt-trippy | "I'm not mad, just disappointed" vibes |

**Template Structure:**
```typescript
interface PromptTemplate {
  systemPrompt: string;
  buildUserPrompt: (data: JudgmentData) => string;
}

interface JudgmentData {
  allocations: TimeAllocation[];
  timePeriod: TimePeriod;
  totalHours: number;
}
```

---

### Task 3: Create Claude Service

Create `src/services/claude.ts` to handle all Claude API interactions.

**Functions to implement:**

```typescript
// Generate a judgment/roast based on time allocation
export async function generateJudgment(
  request: JudgmentRequest
): Promise<JudgmentResponse>;

// Build the full prompt from template and data
function buildPrompt(
  personality: JudgePersonality,
  allocations: TimeAllocation[],
  timePeriod: TimePeriod
): { systemPrompt: string; userPrompt: string };

// Format allocation data for the prompt
function formatAllocationsForPrompt(
  allocations: TimeAllocation[],
  timePeriod: TimePeriod
): string;
```

**API Configuration:**
- Model: `claude-3-haiku-20240307` (fast and cost-effective for short responses)
- Max tokens: 150 (keep responses concise)
- Temperature: 0.9 (more creative/varied responses)

**Error Handling:**
- Network errors
- API rate limits
- Invalid API key
- Timeout (10 second limit)
- Return user-friendly error messages

---

### Task 4: Create Judgment Slice for Redux

Create `src/store/judgmentSlice.ts` to manage judgment state.

**State Shape:**
```typescript
interface JudgmentState {
  currentJudgment: string | null;
  loading: boolean;
  error: string | null;
  lastRequestedAt: number | null;
  // Cache recent judgments to avoid redundant API calls
  cache: {
    [key: string]: {  // key = `${timePeriod}-${personality}-${dataHash}`
      text: string;
      generatedAt: number;
    };
  };
}
```

**Actions:**
- `requestJudgment` (async thunk)
- `clearJudgment`
- `clearError`

**Cache Strategy:**
- Cache judgments for 5 minutes
- Invalidate cache when time allocation data changes significantly
- Generate cache key from: timePeriod + personality + data hash

---

### Task 5: Update LifeScreen Integration

Update `src/screens/LifeScreen.tsx` to use real Claude API.

**Changes:**
- Replace placeholder judgment state with Redux state
- Connect `handleRequestJudgment` to dispatch the async thunk
- Show appropriate error states
- Disable button during API calls
- Clear judgment when time period changes (or show cached)

---

### Task 6: Secure API Key Storage

**Development:**
- Store API key in `.env` file
- Add `ANTHROPIC_API_KEY` to `.env.example`

**Production Considerations:**
- Document that API key should ideally go through a backend proxy
- For MVP, key can be bundled (with rate limiting awareness)
- Add warning in Settings screen about API usage

**Environment Setup:**
```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
```

```typescript
// src/config/env.ts
export const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
```

---

### Task 7: Add Rate Limiting & Error UX

**Rate Limiting:**
- Minimum 10 seconds between requests
- Show countdown if user tries to request too soon
- Display "You can request again in X seconds"

**Error States:**
- Network error: "Couldn't connect. Check your internet and try again."
- API error: "The roast machine is taking a break. Try again later."
- Rate limit: "Easy there! Wait a moment before getting roasted again."

**Loading States:**
- Fun loading messages that rotate:
  - "Analyzing your life choices..."
  - "Preparing maximum judgment..."
  - "Loading brutal honesty..."
  - "Consulting the sass oracle..."

---

## File Structure

```
src/
├── constants/
│   └── prompts.ts          # NEW: Personality prompt templates
├── services/
│   └── claude.ts           # NEW: Claude API service
├── store/
│   └── judgmentSlice.ts    # NEW: Judgment state management
├── config/
│   └── env.ts              # NEW: Environment variable access
└── screens/
    └── LifeScreen.tsx      # UPDATED: Real API integration
```

---

## Prompt Examples

### Sarcastic Friend

**System Prompt:**
```
You are a sarcastic friend who loves to playfully roast your buddy about their life choices. You're supportive deep down but can't resist making jokes. Keep it light and fun - tease, don't hurt.

Rules:
- Keep responses to 2-3 sentences max
- Reference specific percentages when funny
- If something is at 0%, definitely mention it
- Be witty, not mean-spirited
- Use casual, conversational language
```

**User Prompt Example:**
```
My friend spent their week like this:
- Work: 45% (18 hours)
- Play: 25% (10 hours)
- Health: 5% (2 hours)
- Romance: 0% (0 hours)
- Study: 25% (10 hours)

Total tracked: 40 hours

Give them a quick roast about this distribution.
```

**Expected Response:**
```
45% work and 0% romance? Sounds like your keyboard is getting more action than you are. At least those 2 hours of "health" means you're walking to the fridge, right?
```

### Cruel Comedian

**System Prompt:**
```
You are a brutal stand-up comedian roasting an audience member about their life priorities. No filter, no mercy - but keep it clever, not crude. Think roast battle, not bullying.

Rules:
- 2-3 sentences max
- Go for the jugular on imbalances
- Zero percentages are comedy gold
- Be savage but smart
- No profanity, just wit
```

### Disappointed Parent

**System Prompt:**
```
You are a disappointed parent reviewing your adult child's time management. Heavy sighs, guilt trips, and passive-aggressive concern. You're not angry, just... disappointed.

Rules:
- 2-3 sentences max
- Use phrases like "I'm not mad, but..." or "When I was your age..."
- Express concern that masks judgment
- Mention what they SHOULD be doing
- Subtle guilt trips are your specialty
```

---

## API Request Format

```typescript
// POST https://api.anthropic.com/v1/messages
{
  "model": "claude-3-haiku-20240307",
  "max_tokens": 150,
  "temperature": 0.9,
  "system": "<personality system prompt>",
  "messages": [
    {
      "role": "user",
      "content": "<formatted time allocation data>"
    }
  ]
}
```

**Headers:**
```typescript
{
  "Content-Type": "application/json",
  "x-api-key": ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01"
}
```

---

## Testing Checklist

- [ ] API key loads correctly from environment
- [ ] Successful judgment generation for all personalities
- [ ] Error handling for network failures
- [ ] Error handling for invalid API key
- [ ] Rate limiting prevents spam requests
- [ ] Loading states display correctly
- [ ] Cache prevents redundant API calls
- [ ] Judgment clears when personality changes
- [ ] Different time periods generate different roasts

---

## Security Notes

1. **API Key Exposure**: In a client-only app, the API key will be bundled. For production:
   - Consider a lightweight backend proxy
   - Implement usage monitoring
   - Set up billing alerts on Anthropic dashboard

2. **Rate Limiting**: The 10-second client-side limit helps, but server-side limits should be considered for production.

3. **Content Filtering**: Claude has built-in safety, but monitor for edge cases where time data might generate inappropriate responses.

---

## Cost Estimation

Using Claude 3 Haiku:
- Input: ~200 tokens per request
- Output: ~50 tokens per response
- Cost: ~$0.0003 per judgment
- 1000 users × 10 roasts/day = $3/day

---

## Success Criteria

1. User can tap "Get Roasted" and receive a personalized AI judgment
2. Each personality delivers distinctly different tones
3. Responses reference the actual time allocation data
4. Errors are handled gracefully with user-friendly messages
5. Loading state provides entertaining feedback
6. No duplicate API calls for same data within cache window
