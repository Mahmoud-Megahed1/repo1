import {
  ImagePreview,
  ImageRemover,
  ImageTrigger,
  ImageUploader,
} from '@/components/ui/image-uploader';
import useDragAndDrop from '@/hooks/useDragAndDrop';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import { FieldValues, Path, useForm } from 'react-hook-form';

type Props<T extends FieldValues> = {
  form: ReturnType<typeof useForm<T>>;
  name: Path<T>;
};
const ImageFormField = <T extends FieldValues>({ form, name }: Props<T>) => {
  const { handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop({
    onDrop: (droppedFile) => {
      form.setValue(name, droppedFile as never);
    },
  });
  return (
    <ImageUploader
      value={form.getValues(name)}
      onValueChange={(value) => form.setValue(name, value as never)}
    >
      <ImageTrigger>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'dark:border-primary-300 my-4 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary p-4',
          )}
        >
          <UploadCloud size={40} className="text-primary" />
          <span className="dark:text-primary-300 text-base font-bold text-primary">
            Upload attachment
            <span className="text-destructive">*</span>
          </span>
          <span className="text-sm">Drag to upload</span>
        </div>
      </ImageTrigger>
      <ImagePreview>
        <ImageRemover />
      </ImagePreview>
    </ImageUploader>
  );
};

export default ImageFormField;
