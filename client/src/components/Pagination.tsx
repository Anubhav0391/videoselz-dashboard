import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const canGoPrev = page > 1 && !disabled;
  const canGoNext = page < totalPages && !disabled;

  return (
    <nav aria-label="Video analytics pagination" className={styles.pagination}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev}
      >
        <FiChevronLeft aria-hidden="true" />
      </button>
      <span className={styles.summary} aria-live="polite">
        Page {page} of {totalPages || 1}
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
      >
        <FiChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}
