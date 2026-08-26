import { useCallback, useEffect, useState } from "react";
import { fetchVideoAnalytics } from "../api/analytics";
import type { PaginationMeta, VideoAnalytics } from "../types/analytics";

const DEFAULT_LIMIT = 5;

interface UseVideoAnalyticsResult {
  videos: VideoAnalytics[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useVideoAnalytics(
  limit: number = DEFAULT_LIMIT,
): UseVideoAnalyticsResult {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState<VideoAnalytics[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumping this re-runs the effect below without changing page/limit —
  // gives callers a way to refresh the current page (e.g. after simulating
  // traffic later) without duplicating the fetch logic.
  const [reloadToken, setReloadToken] = useState(0);

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
            : "Failed to load video analytics.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [page, limit, reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { videos, pagination, loading, error, page, setPage, refetch };
}
