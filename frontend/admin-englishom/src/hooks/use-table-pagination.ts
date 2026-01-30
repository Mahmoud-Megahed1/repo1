import { boundedValue } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useTablePagination = ({
  totalPages,
  chunkSize = 5,
  defaultPage = 1,
}: {
  totalPages: number;
  chunkSize?: number;
  defaultPage?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);

  const startChunkPage = Math.max(
    1,
    currentPage - ((currentPage - 1) % chunkSize),
  );
  const endChunkPage = Math.min(totalPages, startChunkPage + chunkSize - 1);

  const chunkPages = useMemo(() => {
    return Array.from(
      { length: endChunkPage - startChunkPage + 1 },
      (_, i) => startChunkPage + i,
    );
  }, [startChunkPage, endChunkPage]);

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const hasNextChunk = endChunkPage < totalPages;
  const hasPrevChunk = startChunkPage > 1;

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(() =>
        boundedValue({
          min: 1,
          max: totalPages,
        })(page),
      );
    },
    [totalPages],
  );

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextChunk = useCallback(() => {
    if (hasNextChunk) {
      setCurrentPage(Math.min(totalPages, endChunkPage));
    }
  }, [hasNextChunk, endChunkPage, totalPages]);

  const goToPrevChunk = useCallback(() => {
    if (hasPrevChunk) {
      setCurrentPage(Math.max(1, startChunkPage - chunkSize + 1));
    }
  }, [hasPrevChunk, startChunkPage, chunkSize]);

  const getNextChunk = useCallback(() => {
    if (!hasNextChunk) return [];
    const nextStartChunkPage = endChunkPage;
    const nextEndChunkPage = Math.min(
      totalPages,
      nextStartChunkPage + chunkSize - 1,
    );

    return Array.from(
      { length: nextEndChunkPage - nextStartChunkPage + 1 },
      (_, i) => nextStartChunkPage + i,
    );
  }, [endChunkPage, chunkSize, totalPages, hasNextChunk]);

  const getLastChunk = useCallback(() => {
    const lastStartChunkPage = totalPages - ((totalPages - 1) % chunkSize);
    const lastEndChunkPage = totalPages;

    return Array.from(
      { length: lastEndChunkPage - lastStartChunkPage + 1 },
      (_, i) => lastStartChunkPage + i,
    );
  }, [chunkSize, totalPages]);

  const getFirstChunk = useCallback(() => {
    const firstStartChunkPage = 1;
    const firstEndChunkPage = Math.min(chunkSize, totalPages);

    return Array.from(
      { length: firstEndChunkPage - firstStartChunkPage + 1 },
      (_, i) => firstStartChunkPage + i,
    );
  }, [chunkSize, totalPages]);

  useEffect(() => {
    setCurrentPage(defaultPage);
  }, [defaultPage]);

  return {
    currentPage,
    chunkPages,
    goToPage,
    goToNext,
    goToPrev,
    goToNextChunk,
    goToPrevChunk,
    getNextChunk,
    getLastChunk,
    getFirstChunk,
    hasNext,
    hasPrev,
    hasNextChunk,
    hasPrevChunk,
    lastPage: totalPages,
  };
};

export default useTablePagination;
