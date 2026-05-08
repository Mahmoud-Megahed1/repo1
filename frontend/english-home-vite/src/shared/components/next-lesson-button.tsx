import { cn } from '@lib/utils';
import { useNavigate } from '@shared/i18n/routing';
import type { LessonId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { CheckCircle2 } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  lessonName: LessonId;
} & React.ComponentProps<typeof Button>;

const NextLessonButton: FC<Props> = ({ lessonName, className, onClick, disabled, ...restProps }) => {
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
    <div className="flex flex-col items-end gap-2">
      {!disabled && (
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-bold text-green-800 shadow-sm animate-in fade-in zoom-in duration-300 dark:bg-green-900/50 dark:text-green-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{t('Global.lessonCompleted')}</span>
        </div>
      )}
      <Button
        variant={'outline-primary'}
        {...restProps}
        disabled={disabled}
        className={cn('self-end', className)}
        onClick={handleClick}
      >
        {t('Global.next')} - {t(`Global.sidebarItems.${lessonName}`)}
      </Button>
    </div>
  );
};

export default NextLessonButton;
