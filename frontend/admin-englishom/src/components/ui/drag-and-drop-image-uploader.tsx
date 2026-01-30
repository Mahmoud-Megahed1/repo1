'use client';
import {
  ImagePreview,
  ImageRemover,
  ImageTrigger,
  ImageUploader,
} from '@/components/ui/image-uploader';
import useDragAndDrop from '@/hooks/useDragAndDrop';
import { cn, isValidImage } from '@/lib/utils';
import { Hand } from 'lucide-react';
import React, { FC, useState } from 'react';
type DragAndDropImageUploaderProps = React.ComponentProps<typeof ImageUploader>;
const DragAndDropImageUploader: FC<DragAndDropImageUploaderProps> = ({
  onValueChange,
  ...props
}) => {
  const [file, setFile] = useState<File | undefined>();

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop({
      onDrop: (droppedFile) => {
        onValueChange?.(droppedFile);
        setFile(droppedFile || undefined);
      },
    });
  return (
    <ImageUploader
      value={file}
      onValueChange={(value) => {
        if (value && !isValidImage(value)) return setFile(undefined);
        onValueChange?.(value);
        setFile(value);
      }}
      {...props}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'bg-primary-0 rounded-sm px-4 py-6 text-center text-sm font-bold dark:bg-neutral-200',
          {
            'ring-2 ring-primary': isDragging,
          },
        )}
      >
        {isDragging ? (
          'Drop the file here'
        ) : (
          <>
            {' '}
            Drag and drop or{' '}
            <ImageTrigger className="link cursor-pointer text-sm">
              browse
            </ImageTrigger>{' '}
            your files
          </>
        )}
      </div>
      <ImagePreview alt="Profile image" className="group">
        <ImageRemover className="hidden group-hover:block" />
      </ImagePreview>
      {file && (
        <div className="flex h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-neutral-100 p-2 dark:bg-neutral-200">
          <Hand size={18} className="text-neutral-500" />
          <p className="text-sm font-bold text-neutral-900">
            Hover on image to see options
          </p>
        </div>
      )}
    </ImageUploader>
  );
};

export default DragAndDropImageUploader;
