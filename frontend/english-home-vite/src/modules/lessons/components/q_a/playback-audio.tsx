import { useAudiosStore } from '@hooks/use-audios-store';
import useLocale from '@hooks/use-locale';
import { Button } from '@ui/button';
import { Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';

const PlaybackAudio = ({ src }: { src: string }) => {
  const id = useId();
  const { playExclusive, register, getAudioState, unregister } =
    useAudiosStore();
  const { isPlaying } = getAudioState(id) || {};
  const { t } = useTranslation();
  const locale = useLocale();
  useEffect(() => {
    const audio = new Audio(src);
    register(id, audio);
    return () => unregister(id);
  }, [src, register, unregister, id]);
  return (
    <div
      lang={locale}
      className="bg-accent/30 inline-flex items-center justify-between gap-4 rounded-md border p-4"
    >
      <Button
        onClick={() => playExclusive(id)}
        variant={isPlaying ? 'secondary' : 'default'}
        className="rounded-full"
        size={'icon'}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <div>
        <p className="text-sm">{t('Global.listenToAudio')}</p>
        <p className="text-muted-foreground text-xs">
          {t('Global.clickToPlay')}
        </p>
      </div>
      <Volume2 className="text-muted-foreground size-4" />
    </div>
  );
};

export default PlaybackAudio;
