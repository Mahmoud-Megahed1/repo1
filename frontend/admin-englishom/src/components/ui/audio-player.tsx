import { cn } from '@/lib/utils';
import React, { FC } from 'react';

const AudioPlayer: FC<React.ComponentProps<'audio'>> = ({
  className,
  ...props
}) => (
  <audio
    controls
    controlsList="nodownload"
    className={cn('w-full', className)}
    {...props}
  >
    <track kind="captions" src={''} srcLang="en" label="English captions" />
  </audio>
);

export default AudioPlayer;
