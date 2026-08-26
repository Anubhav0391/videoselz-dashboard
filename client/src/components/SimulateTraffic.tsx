import { useState } from 'react';
import { FiZap, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { postEngagementEvent } from '../api/events';
import type { EventType } from '../types/events';
import type { VideoAnalytics } from '../types/analytics';
import styles from './SimulateTraffic.module.css';

// Mirrors the seed data's funnel shape (mostly views, fewer clicks, fewest
// add-to-carts) so simulated traffic looks like a realistic event, not noise.
const EVENT_WEIGHTS: { type: EventType; weight: number }[] = [
  { type: 'view', weight: 0.7 },
  { type: 'click', weight: 0.22 },
  { type: 'add_to_cart', weight: 0.08 },
];

function pickWeightedEventType(): EventType {
  const r = Math.random();
  let cumulative = 0;
  for (const { type, weight } of EVENT_WEIGHTS) {
    cumulative += weight;
    if (r < cumulative) return type;
  }
  return 'view';
}

function pickRandomVideo(videos: VideoAnalytics[]): VideoAnalytics {
  return videos[Math.floor(Math.random() * videos.length)];
}

interface SimulateTrafficProps {
  // Picks from whatever's currently loaded/visible, rather than needing a
  // separate "list all video ids" endpoint that isn't part of this API.
  videos: VideoAnalytics[];
  onEventCreated: (videoId: number, eventType: EventType) => void;
}

export function SimulateTraffic({ videos, onEventCreated }: SimulateTrafficProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = submitting || videos.length === 0;

  async function handleClick() {
    const video = pickRandomVideo(videos);
    const eventType = pickWeightedEventType();

    setSubmitting(true);
    setError(null);

    try {
      await postEngagementEvent(video.videoId, eventType);
      onEventCreated(video.videoId, eventType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate traffic.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.button} onClick={handleClick} disabled={disabled}>
        {submitting ? (
          <FiLoader className="icon-spin" aria-hidden="true" />
        ) : (
          <FiZap aria-hidden="true" />
        )}
        {submitting ? 'Simulating…' : 'Simulate Traffic'}
      </button>
      {error && (
        <p role="alert" className={styles.error}>
          <FiAlertCircle aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}