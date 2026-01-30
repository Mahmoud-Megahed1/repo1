import React, { useCallback, useState } from 'react';

type UseDragAndDropOptions = {
  // eslint-disable-next-line no-unused-vars
  onDrop: (file: File | undefined) => void;
};

const useDragAndDrop = ({ onDrop }: UseDragAndDropOptions) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        onDrop(droppedFiles[0]);
      } else {
        onDrop(undefined);
      }
    },
    [onDrop],
  );

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

export default useDragAndDrop;
