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
    <Card className={cn('backface-hidden absolute inset-0 border-border/50 shadow-xl overflow-hidden')}>
      <CardHeader className="p-0 overflow-hidden bg-secondary/50">
        <div className="relative w-full h-56 flex items-center justify-center p-2">
          <img
            src={pictureSrc}
            className="h-full rounded-lg object-contain shadow-2xl transition-transform duration-500 hover:scale-110"
            alt={definitionAr}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h3 lang="en" className="text-2xl font-bold tracking-tight text-primary">
            {definitionEn}
          </h3>
          <h3 lang="ar" className="text-xl font-bold text-muted-foreground/80">
            {definitionAr}
          </h3>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <audio ref={ref} src={soundSrc} preload="auto" hidden />
          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="h-14 px-8 rounded-full shadow-lg transition-all hover:shadow-primary/20 active:scale-95"
            variant={isPlaying ? 'secondary' : 'default'}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                {t('Global.pause')}
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                {t('Global.play')}
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant={'success'}
            onClick={(e) => {
              e.stopPropagation();
              onFlip?.();
            }}
            className="h-14 px-8 rounded-full shadow-lg transition-all hover:shadow-success/20 active:scale-95"
          >
            <Eye className="mr-2 h-5 w-5" /> {t('Global.example')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrontSide;
