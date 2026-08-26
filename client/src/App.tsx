import { VideoAnalyticsTable } from "./components/VideoAnalyticsTable";
import { Pagination } from "./components/Pagination";
import { useVideoAnalytics } from "./hooks/useVideoAnalytics";
import styles from "./App.module.css";

function App() {
  const { videos, pagination, loading, error, setPage } =
    useVideoAnalytics();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav aria-label="Main">
          <span className={styles.brand}>Videoselz</span>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeading}>
          <div>
            <h1 className={styles.title}>Shoppable Video Analytics</h1>
            <p className={styles.subtitle}>
              Views, clicks, and add-to-cart conversions for every shoppable
              video.
            </p>
          </div>
        </div>

        {loading && (
          <p role="status" className={styles.statusMessage}>
            Loading video analytics…
          </p>
        )}

        {!loading && error && (
          <p role="alert" className={styles.errorMessage}>
            Couldn&apos;t load video analytics: {error}
          </p>
        )}

        {!loading && !error && videos.length === 0 && (
          <p className={styles.statusMessage}>No videos found.</p>
        )}

        {!loading && !error && videos.length > 0 && (
          <>
            <VideoAnalyticsTable videos={videos} />
            {!!pagination && (
              <Pagination
                page={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.limit)}
                total={pagination.total}
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
