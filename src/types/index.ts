// Category types for event classification
export enum Category {
  WORK = 'work',
  PLAY = 'play',
  HEALTH = 'health',
  ROMANCE = 'romance',
  STUDY = 'study',
  UNCATEGORIZED = 'uncategorized',
}

// Raw event from Google Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
}

// Event with category assigned
export interface CategorizedEvent extends CalendarEvent {
  category: Category;
  categoryConfirmed: boolean;
}

// Time allocation for pie chart
export interface TimeAllocation {
  category: Category;
  totalMinutes: number;
  percentage: number;
  eventCount: number;
}

// Time period options for analysis
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

// Judge personality types
export type JudgePersonality = 'sarcastic_friend' | 'cruel_comedian' | 'disappointed_parent';

// Judgment request for Claude API
export interface JudgmentRequest {
  allocations: TimeAllocation[];
  timePeriod: TimePeriod;
  personality: JudgePersonality;
}

// Judgment response from Claude API
export interface JudgmentResponse {
  text: string;
  generatedAt: Date;
}

// App navigation param list
export type RootTabParamList = {
  Calendar: undefined;
  Life: undefined;
  Settings: undefined;
};

// ============================================
// Google Calendar API Types
// ============================================

// Google Calendar event datetime
export interface GoogleDateTime {
  dateTime?: string; // ISO 8601 for timed events
  date?: string; // YYYY-MM-DD for all-day events
  timeZone?: string;
}

// Raw Google Calendar event from API
export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: GoogleDateTime;
  end: GoogleDateTime;
  status: 'confirmed' | 'tentative' | 'cancelled';
  htmlLink?: string;
  created?: string;
  updated?: string;
}

// Google Calendar list response
export interface GoogleCalendarListResponse {
  kind: string;
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
  nextSyncToken?: string;
}

// Event creation payload
export interface CreateEventPayload {
  summary: string;
  description?: string;
  start: GoogleDateTime;
  end: GoogleDateTime;
}

// ============================================
// Auth Types
// ============================================

// Stored authentication tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp in milliseconds
  idToken?: string;
}

// Google user profile info
export interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}
