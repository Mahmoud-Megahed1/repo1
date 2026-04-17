import useAudioPlayer from '@hooks/use-audio-player';
import { AudioPlayer } from './audio-player';

type Props = {
  audioSrc: string;
  title?: string;
  className?: string;
  download?: boolean;
  onPlay?: () => void;
};

export function AudioPlayback({
  audioSrc,
  title = 'Audio',
  className,
  download = false,
  onPlay,
}: Props) {
  title = document.querySelector('html')?.lang === 'ar' ? 'مقطع صوتي' : title;
  const {
    ref,
    togglePlay,
    currentTime,
    duration,
    isPlaying,
    isMuted,
    handleMute,
    setCurrentTime,
    setVolume,
    resetAudio,
    volume,
  } = useAudioPlayer();

  const handleTogglePlay = () => {
    togglePlay();
    if (!isPlaying && onPlay) {
      onPlay();
    }
  };

  return (
    <AudioPlayer
      audioSrc={audioSrc}
      ref={ref}
      onTogglePlay={handleTogglePlay}
      onCurrentTimeChange={setCurrentTime}
      onReset={resetAudio}
      onToggleMute={handleMute}
      onVolumeChange={setVolume}
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      isMuted={isMuted}
      volume={volume}
      title={title}
      className={className}
      download={download}
    />
  );
}
