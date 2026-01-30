import useAudioPlayer from '@hooks/use-audio-player';
import { AudioPlayer } from './audio-player';

type Props = {
  audioSrc: string;
  title?: string;
  className?: string;
  download?: boolean;
};

export function AudioPlayback({
  audioSrc,
  title = 'Audio',
  className,
  download = false,
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

  return (
    <AudioPlayer
      audioSrc={audioSrc}
      ref={ref}
      onTogglePlay={togglePlay}
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
