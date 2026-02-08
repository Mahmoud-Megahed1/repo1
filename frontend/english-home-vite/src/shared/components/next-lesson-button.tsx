import { cn } from '@lib/utils';
import { useNavigate } from '@shared/i18n/routing';
import type { LessonId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  lessonName: LessonId;
} & React.ComponentProps<typeof Button>;

const NextLessonButton: FC<Props> = ({ lessonName, className, onClick, ...restProps }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Fire onClick (task completion) async without waiting - navigate immediately
    if (onClick) {
      // Fire and forget - don't await, just let it run in background
      Promise.resolve(onClick(e)).catch((error) => {
        console.error('Error in NextLessonButton onClick:', error);
      });
    }
    // Navigate immediately without waiting for onClick to complete
    navigate({
      to: '/app/levels/$id/$day/$lessonName',
      params: { ...params, lessonName } as never,
    });
  };

  return (
    <Button
      variant={'outline-primary'}
      {...restProps}
      className={cn('self-end', className)}
      onClick={handleClick}
    >
      {t('Global.next')} - {t(`Global.sidebarItems.${lessonName}`)}
    </Button>
  );
};

export default NextLessonButton;
