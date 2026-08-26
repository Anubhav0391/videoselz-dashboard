import type { CreatedEvent, EventType } from '../types/events';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function postEngagementEvent(videoId: number, eventType: EventType): Promise<CreatedEvent> {
  const response = await fetch(new URL('/api/events', API_BASE_URL).toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId, eventType }),
  });

  if (!response.ok) {
    // Same pattern as api/analytics.ts — surface the backend's { error } message when present.
    const body = await response.json().catch(() => null);
    const message =
      body && typeof body.error === 'string' ? body.error : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<CreatedEvent>;
}