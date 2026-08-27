import { FiVideo, FiAlertCircle, FiInbox, FiLoader } from "react-icons/fi";
import { VideoAnalyticsTable } from "./components/VideoAnalyticsTable";
import { Pagination } from "./components/Pagination";
import { SimulateTraffic } from "./components/SimulateTraffic";
import { useVideoAnalytics } from "./hooks/useVideoAnalytics";
import styles from "./App.module.css";

function App() {
  const { videos, pagination, loading, error, setPage, applyEventLocally } =
    useVideoAnalytics();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav aria-label="Main">
          <span className={styles.brand}>
            <FiVideo aria-hidden="true" />
            Videoselz
          </span>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeading}>
          <h1 className={styles.title}>Shoppable Video Analytics</h1>
          <p className={styles.subtitle}>
            Views, clicks, and add-to-cart conversions for every shoppable
            video.
          </p>
          <SimulateTraffic videos={videos} onEventCreated={applyEventLocally} />
        </div>

        {loading && (
          <p role="status" className={styles.statusMessage}>
            <FiLoader className="icon-spin" aria-hidden="true" />
            Loading video analytics…
          </p>
        )}

        {!loading && error && (
          <p role="alert" className={styles.errorMessage}>
            <FiAlertCircle aria-hidden="true" />
            Couldn&apos;t load video analytics: {error}
          </p>
        )}

        {!loading && !error && videos.length === 0 && (
          <p className={styles.statusMessage}>
            <FiInbox aria-hidden="true" />
            No videos found.
          </p>
        )}

        {!loading && !error && videos.length > 0 && (
          <>
            <VideoAnalyticsTable videos={videos} />
            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.limit)}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
