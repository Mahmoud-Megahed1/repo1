import { cn } from '@/lib/utils';
import { EarIcon } from 'lucide-react';
import React, { FC, useRef } from 'react';
type Props = React.ComponentProps<'button'> & {
  soundSrc: string;
};
const EarSound: FC<Props> = ({ soundSrc, className, onClick, ...props }) => {
  const ref = useRef<HTMLAudioElement>(null);
  return (
    <>
      <button
        onClick={(e) => {
          const audioElement = ref.current;
          if (audioElement && audioElement.paused) {
            audioElement.play();
          } else {
            audioElement?.pause();
          }
          onClick?.(e);
        }}
        className={cn(
          'rounded-full bg-primary p-1 text-primary-foreground',
          className,
        )}
        {...props}
      >
        <EarIcon />
      </button>
      <audio src={soundSrc} controlsList="nodownload" ref={ref} hidden>
        <track
          kind="captions"
          src={''}
          srcLang="en"
          label="English captions"
          default
        />
      </audio>
    </>
  );
};

export default EarSound;
