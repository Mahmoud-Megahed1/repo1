import useAudioPlayer from '@hooks/use-audio-player';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader } from '@ui/card';
import { Eye, Pause, Play } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  definitionAr: string;
  definitionEn: string;
  pictureSrc: string;
  soundSrc: string;
  onFlip?: () => void;
};
const FrontSide: FC<Props> = ({
  definitionAr,
  definitionEn,
  pictureSrc,
  soundSrc,
  onFlip,
}) => {
  const { t } = useTranslation();
  const { togglePlay, isPlaying, ref } = useAudioPlayer();
  return (
    <Card className={cn('backface-hidden absolute inset-0 border-none')}>
      <CardHeader className="p-0">
        <img
          src={pictureSrc}
          className="mx-auto h-48 w-full rounded-xl object-contain"
          alt={definitionAr}
        />
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <h3 lang="en" className="text-lg font-bold capitalize">
          {definitionEn}
        </h3>
        <h3 lang="ar" className="text-lg font-bold">
          {definitionAr}
        </h3>
        <div className="mt-6 flex items-center gap-4">
          <audio ref={ref} src={soundSrc} preload="auto" hidden />
          <Button
            onClick={() => {
              togglePlay();
            }}
            variant={isPlaying ? 'secondary' : 'default'}
          >
            {isPlaying ? (
              <>
                <Pause />
                {t('Global.pause')}
              </>
            ) : (
              <>
                <Play />
                {t('Global.play')}
              </>
            )}
          </Button>
          <Button variant={'success'} onClick={onFlip}>
            <Eye /> {t('Global.example')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrontSide;
