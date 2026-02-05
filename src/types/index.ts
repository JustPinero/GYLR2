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
};
