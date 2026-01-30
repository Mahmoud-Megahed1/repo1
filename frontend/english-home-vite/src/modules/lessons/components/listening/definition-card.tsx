import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { Pause, Volume2 } from 'lucide-react';
import { useEffect, useId } from 'react';
import { useAudiosStore } from '@hooks/use-audios-store';

type Props = {
  word: string;
  definition: string;
  soundSrc: string;
  index: number;
};

export function DefinitionCard({ word, definition, soundSrc, index }: Props) {
  const id = useId();
  const { getAudioState, playExclusive, register, unregister } = useAudiosStore(
    (state) => state
  );

  useEffect(() => {
    const audioElement = new Audio(soundSrc);
    register(id, audioElement);
    return () => {
      audioElement.pause();
      unregister(id);
    };
  }, [soundSrc, id, register, unregister]);

  return (
    <Card className="border-none p-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-secondary/30 text-secondary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
            {index}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-foreground font-semibold capitalize">{word}</h4>
            <Button
              onClick={() => playExclusive(id)}
              variant={getAudioState(id)?.isPlaying ? 'secondary' : 'ghost'}
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
            >
              {getAudioState(id)?.isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {definition}
          </p>
        </div>
      </div>
    </Card>
  );
}
