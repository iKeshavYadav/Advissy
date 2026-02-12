
import { CalendarProvider } from "../types";

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: number; // timestamp
  durationMinutes: number;
}

export const generateCalendarUrl = (event: CalendarEvent, provider: CalendarProvider): string => {
  const start = new Date(event.startTime);
  const end = new Date(event.startTime + event.durationMinutes * 60 * 1000);

  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

  if (provider === 'google') {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
      text: event.title,
      details: event.description,
      location: event.location,
      dates: `${formatDate(start)}/${formatDate(end)}`,
    });
    return `${baseUrl}&${params.toString()}`;
  }

  if (provider === 'outlook') {
    const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      body: event.description,
      location: event.location,
      startdt: start.toISOString(),
      enddt: end.toISOString(),
    });
    return `${baseUrl}?${params.toString()}`;
  }

  return '';
};

export const parseDuration = (durationStr: string): number => {
  if (durationStr.includes('60')) return 60;
  if (durationStr.includes('20')) return 20;
  if (durationStr.includes('90')) return 90;
  return 60;
};
