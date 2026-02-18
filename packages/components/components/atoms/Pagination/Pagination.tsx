import { FC, useMemo } from "react";
import clsx from "clsx";
import styles from "./Pagination.module.scss";

const LEFT_BUFFER = 1;
const RIGHT_BUFFER = 2;
const TOTAL_BUFFER = LEFT_BUFFER + 1 + RIGHT_BUFFER;

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onGoTo: (page: number) => void;
    className?: string;
}

export const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onGoTo, className }) => {
    const hasNext = currentPage < totalPages - 1;
    const hasPrevious = currentPage > 0;
    // const [smallLayout, setSmallLayout] = useState(false);

    const pages = useMemo(() => {
        if (totalPages <= 1 || currentPage >= totalPages) {
            return [];
        }

        const firstPage = 0;
        const lastPage = totalPages - 1;

        const pages = Array.from({ length: totalPages }).map((_, key) => key);

        if (totalPages <= TOTAL_BUFFER) {
            return Array.from({ length: totalPages }).map((_, key) => key);
        }

        const left = pages.slice(currentPage - LEFT_BUFFER, currentPage);
        const right = pages.slice(currentPage + 1, currentPage + 1 + RIGHT_BUFFER);

        const window: (number | null)[] = Array.from(
            new Set([firstPage, ...left, currentPage, ...right, lastPage])
        );

        const mostLeftBufferItem = currentPage - LEFT_BUFFER;
        const mostRightBufferItem = currentPage + RIGHT_BUFFER;

        if (mostLeftBufferItem > firstPage + 1) {
            window.splice(
                window.indexOf(mostLeftBufferItem),
                0,
                mostLeftBufferItem === firstPage + 2 ? firstPage + 1 : null
            );
        }
        if (mostRightBufferItem < lastPage - 1) {
            window.splice(
                window.indexOf(mostRightBufferItem + 1),
                0,
                mostRightBufferItem === lastPage - 2 ? lastPage - 1 : null
            );
        }

        return window;
    }, [currentPage, totalPages]);

    if (!pages.length) {
        return null;
    }

    return (
        <div className={clsx(styles.wrapper, className)} aria-description="Page selection">
            {hasPrevious && (
                <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => onGoTo(currentPage - 1)}
                    aria-label="Previous page">
                    ←
                </button>
            )}
            <div className={styles.pages}>
                {pages.map((index, key) => (
                    <button
                        type="button"
                        key={key}
                        onClick={() => index !== null && onGoTo(index)}
                        tabIndex={index === null || index === currentPage ? -1 : undefined}
                        aria-hidden={index === null}
                        aria-label={
                            index !== null
                                ? index === currentPage
                                    ? `Current page`
                                    : `Page ${index + 1}`
                                : undefined
                        }
                        className={clsx(
                            styles.button,
                            index === currentPage && styles.active,
                            index === null && styles.spacer
                        )}>
                        {index === null ? "..." : index + 1}
                    </button>
                ))}
            </div>
            {hasNext && (
                <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => onGoTo(currentPage + 1)}
                    aria-label="Next page">
                    →
                </button>
            )}
        </div>
    );
};
