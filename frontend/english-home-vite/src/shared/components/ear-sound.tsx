import useAudioPlayer from '@hooks/use-audio-player';
import { cn } from '@lib/utils';
import { EarIcon } from 'lucide-react';
import React, { type FC } from 'react';
type Props = React.ComponentProps<'button'> & {
  soundSrc: string;
};
const EarSound: FC<Props> = ({ soundSrc, className, onClick, ...props }) => {
  const { ref, togglePlay } = useAudioPlayer();
  return (
    <>
      <button
        onClick={(e) => {
          togglePlay();
          onClick?.(e);
        }}
        className={cn(
          'bg-primary text-primary-foreground rounded-full p-1',
          className
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
