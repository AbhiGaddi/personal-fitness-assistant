"use client";

import { useState } from 'react';
import { planWorkouts } from '@/modules/workout-planner/planWorkouts';

export default function PlannerClient() {
  const [showDebug, setShowDebug] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [freeSlots, setFreeSlots] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);

  // Get current day start and end (local time)
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const eventsRes = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          from: dayStart.toISOString(),
          to: dayEnd.toISOString(),
        }),
      });

      if (eventsRes.status === 401) {
        throw new Error('You are not logged in. Please sign in to access your calendar.');
      }

      if (!eventsRes.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      const eventsData = await eventsRes.json();
      const events = eventsData.events || [];
      const freeSlots = eventsData.freeSlots || {};
      setEvents(events);
      setFreeSlots(freeSlots);
      // Use 15min slots for workout suggestion
      const free = freeSlots['15min'] || [];
      if (free.length > 0) {
        setSchedule(planWorkouts({
          freeSlots: free,
          preferences: {
            goals: ['general'],
            equipment: [],
            daysPerWeek: 5,
            preferredTimes: ['morning', 'lunch', 'evening'],
            sessionLengths: [15, 30],
            recovery: { maxHighIntensityPerDay: 1, sleepAware: true },
          },
          weeklyGoals: { focusBalance: { cardio: 2, strength: 2, mobility: 1 } },
        }));
      } else {
        setSchedule([]);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Planner (Google Calendar)</h2>
        <div className="flex items-center gap-2">
          <div
            className="relative group"
            onMouseEnter={() => setShowDebug(true)}
            onMouseLeave={() => setShowDebug(false)}
          >
            <button
              className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
              aria-label="Show debug info"
              type="button"
            >
              i
            </button>
            {showDebug && (
              <div className="absolute right-0 mt-2 w-[min(90vw,600px)] z-50 bg-white border border-gray-300 rounded shadow-lg p-4 text-xs text-left max-h-96 overflow-auto">
                <h3 className="font-semibold mb-2">Raw Google Calendar Events</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">{JSON.stringify(events, null, 2)}</pre>
                <h3 className="font-semibold mt-4 mb-2">Free Time Slots (from Google Calendar)</h3>
                {['5min','10min','15min','30min'].map((g) => (
                  <div key={g} className="mb-2">
                    <div className="font-medium">Granularity: {g}</div>
                    <pre className="bg-green-100 p-2 rounded text-xs overflow-x-auto max-h-32">{JSON.stringify(freeSlots[g] || [], null, 2)}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={fetchEvents}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch My Google Calendar Events'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {schedule.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {schedule.map(s => (
            <div key={s.slotStart + s.workoutId} className="rounded border p-2 bg-white shadow-sm">
              <div className="text-xs text-gray-500">
                {new Date(s.slotStart).toLocaleTimeString()} - {new Date(s.slotEnd).toLocaleTimeString()}
              </div>
              <div className="font-medium text-sm">{s.title}</div>
              <div className="text-[11px] text-gray-600">{s.rationale}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 italic">Fetch your events for workout suggestion</div>
      )}
    </main>
  );
}
