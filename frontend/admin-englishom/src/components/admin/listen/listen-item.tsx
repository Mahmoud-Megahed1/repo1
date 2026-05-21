import EarSound from '@/components/shared/ear-sound';
import DeleteButton from '@/components/shared/delete-button';
import RichTextViewer from '@/components/shared/rich-text-viewer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useDeleteLesson from '@/hooks/use-delete-lesson';
import { cn } from '@/lib/utils';
import { ListenLesson } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { FC } from 'react';

type Props = {
    listen: ListenLesson;
    levelId: LevelId;
    day: string;
};

const ListenItem: FC<Props> = ({
    listen: { id, definitions, soundSrc, transcript },
    day,
    levelId,
}) => {
    const { mutate, isPending } = useDeleteLesson({
        day,
        id,
        levelId,
        lessonName: 'LISTEN',
    });

    return (
        <li
            className={cn(
                'flex flex-col gap-2 rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md',
                {
                    'animate-pulse duration-700': isPending,
                },
            )}
        >
            <div className="space-y-3">
                {/* Audio player */}
                {soundSrc && (
                    <div className="mb-2">
                        <p className="mb-1 font-semibold">Audio:</p>
                        <audio controls className="w-full" crossOrigin="anonymous">
                            <track
                                default
                                kind="captions"
                                src=""
                                srcLang="en"
                                label="English captions"
                            />
                            <source src={soundSrc} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}

                <RichTextViewer lang="en">{transcript ?? ''}</RichTextViewer>

                {/* Definitions */}
                {Array.isArray(definitions) && definitions.length > 0 && (
                    <div className="mb-2">
                        <p className="mb-1 font-semibold">Definitions:</p>
                        <div className="flex flex-col gap-4">
                            {definitions.map(({ definition, word, soundSrc }, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 rounded bg-muted px-4"
                                >
                                    <EarSound soundSrc={soundSrc} className="[&_svg]:size-3" />
                                    <span className="font-semibold text-primary">{word}:</span>
                                    <span className="text-sm text-secondary-foreground">
                                        {definition}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
      <DeleteButton onDelete={() => mutate()} isPending={isPending} />
        </li>
    );
};

export const ListenItemSkeleton = () => (
    <li className="flex h-40 flex-col rounded-lg bg-secondary p-4 text-secondary-foreground shadow-md">
        <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg bg-muted-foreground/20" />
            <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
            <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
            <Skeleton className="h-4 w-full rounded-full bg-muted-foreground/20" />
        </div>
        <Skeleton className="ml-auto mt-auto h-8 w-20 rounded-full bg-muted-foreground/20" />
    </li>
);

export default ListenItem;
