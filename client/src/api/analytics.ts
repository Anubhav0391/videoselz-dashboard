import type { VideoAnalyticsResponse } from '../types/analytics';

// Falls back to the backend's default dev port so this works out of the box
// without requiring a .env file for local development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchVideoAnalytics(page: number, limit: number): Promise<VideoAnalyticsResponse> {
  const url = new URL('/api/analytics/videos', API_BASE_URL);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString());

  if (!response.ok) {
    // The backend returns { error: string } for both 400s and 500s — surface
    // that message when present, otherwise fall back to the HTTP status.
    const body = await response.json().catch(() => null);
    const message = body && typeof body.error === 'string' ? body.error : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<VideoAnalyticsResponse>;
}