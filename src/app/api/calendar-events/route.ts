import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/modules/auth/session';
import { getCalendarEvents } from '@/modules/calendar-reader/getCalendarEvents';
import { findFreeSlots } from '@/modules/free-slot-engine';

export async function POST(req: NextRequest) {
  try {
    const { provider, from, to } = await req.json();
    const session = getSession();

    // Check if user is logged in
    if (!session.providerTokens?.[provider]?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = session.providerTokens[provider].accessToken;
    const events = await getCalendarEvents({ provider, from, to });
    // Calculate free slots for multiple granularities
    const freeSlots = {
      '5min': findFreeSlots(events, from, to, 5),
      '10min': findFreeSlots(events, from, to, 10),
      '15min': findFreeSlots(events, from, to, 15),
      '30min': findFreeSlots(events, from, to, 30),
    };
    return NextResponse.json({
      debug: {
        session,
        token,
        hasToken: !!token,
      },
      events,
      freeSlots
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
