'use client';
import { payment } from '@/services/users';
import { LevelId } from '@/types/user.types';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, LoaderCircle, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { Button } from './ui/button';
type Props = {
  levelId: LevelId;
};
const LevelAccessDenied: React.FC<Props> = ({ levelId }) => {
  const t = useTranslations('LevelsPage');
  const tGlobal = useTranslations('Global');
  const { mutate, isPending } = useMutation({
    mutationKey: ['payment'],
    mutationFn: payment,
    onSuccess(data) {
      window.open(data.data.clientURL, '_blank');
    },
  });
  useEffect(() => {
    document.title = t('accessDenied.title') + ' | ' + tGlobal('appName');
  }, [t, tGlobal]);
  return (
    <div className="container flex h-full flex-col items-center justify-center gap-2 text-center">
      <Lock className="size-16 text-destructive" />
      <h1 className="text-2xl font-bold text-primary md:text-3xl">
        {t('accessDenied.title')}
      </h1>
      <p className="mb-4 text-lg text-muted-foreground">
        {t('accessDenied.description')}
      </p>
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
    </div>
  );
};

export default LevelAccessDenied;
