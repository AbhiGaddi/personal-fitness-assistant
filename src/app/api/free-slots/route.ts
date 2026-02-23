import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/modules/auth/session';
import { getCalendarEvents } from '@/modules/calendar-reader/getCalendarEvents';
import { findFreeSlots } from '@/modules/free-slot-engine';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { provider, from, to, granularity } = body;

  // Check if user is logged in
  const session = getSession();
  if (!session.providerTokens?.[provider]?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const events = await getCalendarEvents({ provider, from, to });
  const free = findFreeSlots(events as any, from, to, granularity || 15);
  return NextResponse.json({ free });
}
