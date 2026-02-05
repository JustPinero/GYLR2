import { CALENDAR_API_BASE } from '../config/google';
import {
  GoogleCalendarEvent,
  GoogleCalendarListResponse,
  CreateEventPayload,
  CalendarEvent,
  GoogleDateTime,
} from '../types';
import { parseGoogleDateTime, isAllDayEvent } from '../utils/dateUtils';

/**
 * Fetch calendar events within a date range
 */
export async function fetchEvents(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });

  const response = await fetch(
    `${CALENDAR_API_BASE}/calendars/primary/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch events: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as GoogleCalendarListResponse;
  return data.items
    .filter((event) => event.status !== 'cancelled')
    .map(transformGoogleEvent);
}

/**
 * Create a new calendar event
 */
export async function createEvent(
  accessToken: string,
  eventData: CreateEventPayload
): Promise<CalendarEvent> {
  const response = await fetch(
    `${CALENDAR_API_BASE}/calendars/primary/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create event: ${response.status} - ${error}`);
  }

  const createdEvent = (await response.json()) as GoogleCalendarEvent;
  return transformGoogleEvent(createdEvent);
}

/**
 * Update an existing calendar event
 */
export async function updateEvent(
  accessToken: string,
  eventId: string,
  eventData: Partial<CreateEventPayload>
): Promise<CalendarEvent> {
  const response = await fetch(
    `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update event: ${response.status} - ${error}`);
  }

  const updatedEvent = (await response.json()) as GoogleCalendarEvent;
  return transformGoogleEvent(updatedEvent);
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const response = await fetch(
    `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const error = await response.text();
    throw new Error(`Failed to delete event: ${response.status} - ${error}`);
  }
}

/**
 * Transform Google Calendar event to our CalendarEvent format
 */
function transformGoogleEvent(googleEvent: GoogleCalendarEvent): CalendarEvent {
  return {
    id: googleEvent.id,
    title: googleEvent.summary ?? '(No title)',
    description: googleEvent.description,
    startTime: parseGoogleDateTime(googleEvent.start),
    endTime: parseGoogleDateTime(googleEvent.end),
    isAllDay: isAllDayEvent(googleEvent.start),
  };
}

/**
 * Build GoogleDateTime from date and time strings
 */
export function buildGoogleDateTime(
  date: string,
  time?: string,
  isAllDay = false
): GoogleDateTime {
  if (isAllDay) {
    return { date };
  }

  const dateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
  return {
    dateTime: new Date(dateTime).toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
