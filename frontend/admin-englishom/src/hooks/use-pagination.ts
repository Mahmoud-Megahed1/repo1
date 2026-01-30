import { useState } from 'react';

const usePagination = <T>(items: T[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const reset = () => {
    setCurrentIndex(0);
  };

  const currentItem = items[currentIndex];
  const nextItems = items.slice(currentIndex + 1);
  const hasNextItems = nextItems.length > 0;
  const hasPrevItems = currentIndex > 0;

  return {
    currentIndex,
    currentItem,
    next,
    prev,
    reset,
    nextItems,
    hasNextItems,
    hasPrevItems,
  };
};

export default usePagination;
