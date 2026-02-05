import { GoogleDateTime } from '../types';

/**
 * Parse Google Calendar datetime to JavaScript Date
 */
export function parseGoogleDateTime(googleDateTime: GoogleDateTime): Date {
  if (googleDateTime.dateTime) {
    return new Date(googleDateTime.dateTime);
  }
  if (googleDateTime.date) {
    // All-day events: parse as local date
    return new Date(googleDateTime.date + 'T00:00:00');
  }
  return new Date();
}

/**
 * Check if a Google Calendar event is an all-day event
 */
export function isAllDayEvent(start: GoogleDateTime): boolean {
  return !start.dateTime && !!start.date;
}

/**
 * Get start of day for a given date
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day for a given date
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of week (Sunday) for a given date
 */
export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of week (Saturday) for a given date
 */
export function endOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (6 - day));
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of month for a given date
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of month for a given date
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of year for a given date
 */
export function startOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of year for a given date
 */
export function endOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(11, 31);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Format date for display (e.g., "Mon, Jan 15")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time for display (e.g., "2:30 PM")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format datetime for display (e.g., "Mon, Jan 15 at 2:30 PM")
 */
export function formatDateTime(date: Date): string {
  return `${formatDateShort(date)} at ${formatTime(date)}`;
}

/**
 * Calculate duration in minutes between two dates
 */
export function getDurationMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Format duration for display (e.g., "1h 30m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Convert Date to ISO string for Google Calendar API
 */
export function toGoogleDateTime(date: Date, allDay = false): GoogleDateTime {
  if (allDay) {
    return {
      date: date.toISOString().split('T')[0],
    };
  }
  return {
    dateTime: date.toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
