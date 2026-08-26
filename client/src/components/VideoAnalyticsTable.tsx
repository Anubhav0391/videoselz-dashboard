import type { VideoAnalytics } from '../types/analytics';
import styles from './VideoAnalyticsTable.module.css';

// addToCarts / views is undefined at 0 views, not 0% — showing "—" avoids
// implying "this video converts at 0%" when really no one has seen it yet.
function formatConversionRate(addToCarts: number, views: number): string {
  if (views === 0) return '—';
  return `${((addToCarts / views) * 100).toFixed(1)}%`;
}

interface VideoAnalyticsTableProps {
  videos: VideoAnalytics[];
}

export function VideoAnalyticsTable({ videos }: VideoAnalyticsTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <caption className="visually-hidden">Video engagement analytics, one row per video</caption>
        <thead>
          <tr>
            <th scope="col">Video</th>
            <th scope="col">Product</th>
            <th scope="col">Views</th>
            <th scope="col">Clicks</th>
            <th scope="col">Add to Carts</th>
            <th scope="col">Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.videoId}>
              <th scope="row" className={`${styles.videoTitle} ${styles.truncate}`} title={video.title}>
                {video.title}
              </th>
              <td className={styles.truncate} title={video.productName}>
                {video.productName}
              </td>
              <td>{video.views}</td>
              <td>{video.clicks}</td>
              <td>{video.addToCarts}</td>
              <td>{formatConversionRate(video.addToCarts, video.views)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}