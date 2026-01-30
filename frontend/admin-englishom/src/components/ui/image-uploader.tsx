/* eslint-disable @next/next/no-img-element */
'use client';
import { cn, isValidImage } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

type ContextType = {
  image: File | string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
  // eslint-disable-next-line no-unused-vars
  handleSetImage: (file: File | string | undefined) => void;
  id: string;
};

const ImageUploaderContext = createContext<ContextType>({
  image: undefined,
  setImage: () => {},
  id: '',
  handleSetImage: () => {},
});

type ImageUploaderProps = Omit<React.ComponentProps<'input'>, 'value'> & {
  // eslint-disable-next-line no-unused-vars
  onValueChange?: (value: File | undefined) => void;
  defaultImage?: File | string;
  value?: File | string;
};
const ImageUploader = ({
  children,
  defaultImage,
  value,
  onValueChange,
  ...props
}: ImageUploaderProps) => {
  const [image, setImage] = useState<File | string | undefined>(
    defaultImage || value,
  );
  let id = useId();
  if (props.id) id = props.id;

  const handleSetImage = useCallback(
    (file: File | string | undefined) => {
      setImage(file);
      onValueChange?.(typeof file === 'object' ? file : undefined);
    },
    [onValueChange],
  );

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidImage(file)) handleSetImage(file);
    },
    [handleSetImage],
  );

  useEffect(() => {
    if (typeof value !== 'object') {
      setImage(value);
    } else {
      handleSetImage(value);
    }
  }, [handleSetImage, value]);

  const contextValue = useMemo(
    () => ({ image, setImage, id, handleSetImage }),
    [image, id, handleSetImage],
  );

  return (
    <ImageUploaderContext.Provider value={contextValue}>
      {children}
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleOnChange}
        tabIndex={-1}
        hidden
        id={id}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-description`}
        {...props}
      />
    </ImageUploaderContext.Provider>
  );
};

const useImageUploader = () => {
  const context = useContext(ImageUploaderContext);
  if (context === undefined) {
    throw new Error(
      'useImageUploader must be used within a ImageUploaderProvider',
    );
  }
  return context;
};

const ImageTrigger: FC<React.ComponentProps<'label'>> = (props) => {
  const { id } = useImageUploader();
  return (
    <label
      aria-controls={id}
      aria-label="Upload an image"
      htmlFor={id}
      {...props}
    />
  );
};

const ImagePreview: FC<
  React.HTMLAttributes<HTMLDivElement> & { alt?: string }
> = ({ className, alt = 'Image', children, ...props }) => {
  const { image } = useImageUploader();
  const [isError, setIsError] = useState(false);
  return image ? (
    <div className={cn('relative w-full rounded-sm', className)} {...props}>
      <img
        src={typeof image === 'object' ? URL.createObjectURL(image) : image}
        alt={alt}
        onLoad={() => {
          setIsError(false);
        }}
        onError={() => {
          setIsError(true);
        }}
        className={cn('h-auto w-full rounded-[inherit] object-cover', {
          hidden: isError,
        })}
      />
      {isError && <p className="text-destructive"> Failed to load image </p>}
      {children}
    </div>
  ) : null;
};

const ImageRemover: FC<React.ComponentProps<'button'>> = ({
  className,
  children = <Trash2 />,
  ...props
}) => {
  const { image, handleSetImage } = useImageUploader();
  return image ? (
    <button
      type="button"
      onClick={() => handleSetImage(undefined)}
      className={cn(
        'bg-primary-0 absolute right-2 top-2 rounded-full p-2 text-destructive dark:bg-neutral-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ) : null;
};

export { ImagePreview, ImageRemover, ImageTrigger, ImageUploader };
