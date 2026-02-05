import { ANTHROPIC_API_KEY, isClaudeConfigured } from '../config';
import { buildPrompt } from '../constants/prompts';
import {
  JudgmentRequest,
  JudgmentResponse,
  TimeAllocation,
  TimePeriod,
  JudgePersonality,
} from '../types';

// API Configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-haiku-20240307';
const MAX_TOKENS = 150;
const TEMPERATURE = 0.9;
const TIMEOUT_MS = 15000;

// Error types for better error handling
export class ClaudeAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ClaudeAPIError';
  }
}

// API response types
interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeAPIResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ClaudeAPIErrorResponse {
  type: 'error';
  error: {
    type: string;
    message: string;
  };
}

// Generate a judgment/roast based on time allocation
export async function generateJudgment(
  request: JudgmentRequest
): Promise<JudgmentResponse> {
  // Check if API is configured
  if (!isClaudeConfigured()) {
    throw new ClaudeAPIError(
      'Claude API key is not configured. Please add your API key to the .env file.',
      'NOT_CONFIGURED'
    );
  }

  const { allocations, timePeriod, personality } = request;

  // Calculate total minutes for the prompt
  const totalMinutes = allocations.reduce((sum, a) => sum + a.totalMinutes, 0);

  // Build the prompt
  const { systemPrompt, userPrompt } = buildPrompt(
    personality,
    allocations,
    timePeriod,
    totalMinutes
  );

  // Make the API call with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      const errorData = data as ClaudeAPIErrorResponse;
      const errorType = errorData.error?.type ?? 'unknown_error';
      const errorMessage = errorData.error?.message ?? 'Unknown error occurred';

      // Map error types to user-friendly messages
      if (response.status === 401) {
        throw new ClaudeAPIError(
          'Invalid API key. Please check your configuration.',
          'INVALID_API_KEY',
          401
        );
      }

      if (response.status === 429) {
        throw new ClaudeAPIError(
          'Too many requests. Please wait a moment and try again.',
          'RATE_LIMITED',
          429
        );
      }

      if (response.status >= 500) {
        throw new ClaudeAPIError(
          'Claude is having a moment. Please try again later.',
          'SERVER_ERROR',
          response.status
        );
      }

      throw new ClaudeAPIError(errorMessage, errorType, response.status);
    }

    // Extract the response text
    const apiResponse = data as ClaudeAPIResponse;
    const text = apiResponse.content?.[0]?.text;

    if (!text) {
      throw new ClaudeAPIError(
        'Received empty response from Claude.',
        'EMPTY_RESPONSE'
      );
    }

    return {
      text: text.trim(),
      generatedAt: new Date(),
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ClaudeAPIError(
        'Request timed out. Please check your connection and try again.',
        'TIMEOUT'
      );
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ClaudeAPIError(
        'Could not connect to the server. Please check your internet connection.',
        'NETWORK_ERROR'
      );
    }

    // Re-throw ClaudeAPIError
    if (error instanceof ClaudeAPIError) {
      throw error;
    }

    // Handle unknown errors
    throw new ClaudeAPIError(
      'Something went wrong. Please try again.',
      'UNKNOWN_ERROR'
    );
  }
}

// Create a cache key from request parameters
export function createCacheKey(
  allocations: TimeAllocation[],
  timePeriod: TimePeriod,
  personality: JudgePersonality
): string {
  // Create a simple hash of the allocation data
  const dataHash = allocations
    .map((a) => `${a.category}:${a.totalMinutes}`)
    .sort()
    .join('|');

  return `${timePeriod}-${personality}-${dataHash}`;
}
