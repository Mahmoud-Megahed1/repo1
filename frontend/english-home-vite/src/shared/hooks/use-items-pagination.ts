import { useCallback, useState } from 'react';

const useItemsPagination = <T>(items: T[], defaultIndex = 0) => {
  const [index, setIndex] = useState(
    Math.max(0, Math.min(defaultIndex, items.length - 1))
  );

  const next = useCallback(() => {
    setIndex((prev) => Math.min(prev + 1, items.length - 1));
  }, [items.length]);

  const prev = useCallback(() => {
    setIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
  }, []);

  const currentItem = items.at(index);
  const nextItems = items.slice(index + 1);
  const hasNextItems = nextItems.length > 0;
  const hasPrevItems = index > 0;
  const setCurrentIndex = useCallback(
    (index: number) => {
      setIndex(Math.max(0, Math.min(index, items.length - 1)));
    },
    [items.length]
  );

  return {
    currentIndex: index,
    currentItem,
    next,
    prev,
    reset,
    nextItems,
    hasNextItems,
    hasPrevItems,
    setCurrentIndex,
    isLast: index === items.length - 1,
    isFirst: index === 0,
  };
};

export default useItemsPagination;
