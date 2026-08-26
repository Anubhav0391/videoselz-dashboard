import { useEffect, useState } from 'react';
import { fetchVideoAnalytics } from '../api/analytics';
import type { PaginationMeta, VideoAnalytics } from '../types/analytics';
import type { EventType } from '../types/events';

const DEFAULT_LIMIT = 5;

interface UseVideoAnalyticsResult {
  videos: VideoAnalytics[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  applyEventLocally: (videoId: number, eventType: EventType) => void;
}

export function useVideoAnalytics(
  limit: number = DEFAULT_LIMIT,
): UseVideoAnalyticsResult {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState<VideoAnalytics[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchVideoAnalytics(page, limit);

        if (cancelled) return;

        setVideos(res.data);
        setPagination(res.pagination);
      } catch (err: unknown) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load video analytics.',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  function applyEventLocally(videoId: number, eventType: EventType) {
    setVideos((prev) =>
      prev.map((video) => {
        if (video.videoId !== videoId) return video;

        switch (eventType) {
          case 'view':
            return { ...video, views: video.views + 1 };

          case 'click':
            return { ...video, clicks: video.clicks + 1 };

          case 'add_to_cart':
            return { ...video, addToCarts: video.addToCarts + 1 };

          default:
            return video;
        }
      }),
    );
  }

  return {
    videos,
    pagination,
    loading,
    error,
    page,
    setPage,
    applyEventLocally,
  };
}