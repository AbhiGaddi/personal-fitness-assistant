import { getSession } from '@/modules/auth/session';

interface Args { provider: 'google' | 'microsoft'; from: string; to: string; }

export async function getCalendarEvents({ provider, from, to }: Args) {
  const session = getSession();
  const token = session.providerTokens[provider]?.accessToken;
  if (!token) return [];

  if (provider === 'google') {
    const url =
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
      new URLSearchParams({
        timeMin: new Date(from).toISOString(),
        timeMax: new Date(to).toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
      });
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Map Google events to internal format
    return (data.items || []).map((ev: any) => ({
      start: ev.start?.dateTime || ev.start?.date,
      end: ev.end?.dateTime || ev.end?.date,
      allDay: !!ev.start?.date && !ev.start?.dateTime,
    }));
  }
  // Add other providers as needed
  return [];
}
