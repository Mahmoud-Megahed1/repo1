import { cn, downloadRemoteFile, formatTime } from '@lib/utils';
import { Button } from '@ui/button';
import { Card, CardContent } from '@ui/card';
import { Slider } from '@ui/slider';
import {
  Download,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeOff,
} from 'lucide-react';
import { useState, type FC } from 'react';

type Props = {
  audioSrc: string;
  onTogglePlay?: () => void;
  // eslint-disable-next-line no-unused-vars
  onCurrentTimeChange?: (time: number) => void;
  onReset?: () => void;
  onToggleMute?: () => void;
  // eslint-disable-next-line no-unused-vars
  onVolumeChange: (value: number) => void;
  ref?: React.RefObject<HTMLAudioElement | null>;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  isMuted?: boolean;
  title?: string;
  volume?: number;
  className?: string;
  download?: boolean;
};
export const AudioPlayer: FC<Props> = ({
  audioSrc,
  ref,
  onTogglePlay,
  onCurrentTimeChange,
  onToggleMute,
  onVolumeChange,
  onReset,
  currentTime = 0,
  duration = 0,
  volume = 100,
  isMuted = false,
  isPlaying = false,
  title = 'Audio',
  className,
  download = false,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const handleDownload = async () => {
    if (!download) return;
    downloadRemoteFile({
      url: audioSrc,
      onProgress: (percent) => {
        setIsDownloading(true);
        setDownloadProgress(percent);
      },
      onLoad: () => {
        setIsDownloading(false);
      },
    });
  };
  return (
    <Card className={cn(className)}>
      <CardContent className="w-full">
        <audio ref={ref} src={audioSrc} preload="metadata" />

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
          {/* Play/Pause Button */}
          <Button
            onClick={onTogglePlay}
            variant={isPlaying ? 'secondary' : 'default'}
            size="lg"
            className="mx-auto rounded-full sm:mx-0"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </Button>

          {/* Progress Section */}
          <div className="flex-1">
            <div className="text-muted-foreground mb-3 flex flex-wrap items-center justify-between gap-1 text-sm">
              <span className="text-foreground font-medium">{title}</span>
              <span lang="en">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <Slider
              value={[progress]}
              onValueChange={(value) => onCurrentTimeChange?.(value[0])}
              // max={100}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onReset}
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <RotateCcw />
            </Button>

            <div className="flex w-24 items-center gap-2">
              <Button
                onClick={onToggleMute}
                className="text-muted-foreground"
                variant={'ghost'}
                size={'icon'}
              >
                {isMuted ? <VolumeOff /> : <Volume2 />}
              </Button>
              <Slider
                value={[volume]}
                onValueChange={(value) => onVolumeChange?.(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
            {download && !isDownloading && (
              <Button
                className="text-muted-foreground"
                variant={'ghost'}
                size={'icon'}
                onClick={handleDownload}
              >
                <Download />
              </Button>
            )}
            {isDownloading && (
              <span className="text-muted-foreground p-1">
                {downloadProgress.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
