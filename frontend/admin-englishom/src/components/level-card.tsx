'use client';
import { FC } from 'react';

import { Link } from '@/components/shared/smooth-navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { payment } from '@/services/users';
import { LevelId } from '@/types/user.types';
import { useMutation } from '@tanstack/react-query';
import {
  KeyRound,
  LoaderCircle,
  Lock,
  LucideIcon,
  MoveRight,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { RiyalSymbol } from './shared/icons';
import { Skeleton } from './ui/skeleton';

export type CourseLevel = {
  levelId: LevelId;
  title: string;
  description: string;
  levelLabel: string;
  icon: LucideIcon;
  price: number;
  variant?: 'unlocked' | 'locked';
};

const LevelCard: FC<CourseLevel> = ({
  description,
  icon: Icon,
  levelId,
  levelLabel,
  price,
  title,
  variant,
}) => {
  const t = useTranslations('LevelsPage');
  const locale = useLocale();
  const { mutate, isPending } = useMutation({
    mutationKey: ['payment'],
    mutationFn: payment,
    onSuccess(data) {
      window.open(data.data.clientURL, '_blank');
    },
  });
  return (
    <Card className="flex flex-col border text-primary backdrop-blur-lg dark:border-2 dark:border-primary-foreground dark:bg-primary-foreground/30">
      <CardHeader>
        <Icon className="mx-auto size-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            {variant === 'locked' && <Lock />}
          </div>
          <Badge>{levelLabel}</Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
        {variant === 'locked' && (
          <p className="flex items-center">
            <span className="pe-2 text-sm text-muted-foreground">
              {t('price')}:
            </span>
            <span lang="en" className="inline-flex items-center gap-1">
              <RiyalSymbol className="size-4" />
              <b>{price}</b>
            </span>
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        {variant === 'locked' ? (
          <Button
            disabled={isPending}
            onClick={() => {
              mutate({
                data: {
                  level_name: levelId,
                  phone_number: '+201112027058',
                  city: 'Cairo',
                  country: 'Egypt',
                },
              });
            }}
            className="w-full"
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                {t('unlock')}
                <KeyRound />
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="w-full dark:bg-primary-foreground/70 dark:text-primary"
            asChild
          >
            <Link
              href={`/app/levels/${levelId}`}
              className="flex items-center gap-2"
            >
              {t('startLearning')}
              <MoveRight
                className={cn({
                  'rotate-180': locale === 'ar',
                })}
              />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export const CardSkeleton = () =>
  Array.from({ length: 6 }, (_, i) => (
    <Card
      key={i}
      className="flex flex-col border text-primary backdrop-blur-lg dark:border-none dark:bg-primary-foreground/30"
    >
      <CardHeader>
        <Skeleton className="mx-auto size-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="mt-auto">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  ));

export default LevelCard;
