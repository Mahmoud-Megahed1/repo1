import { cn } from '@lib/utils';
import { useNavigate } from '@shared/i18n/routing';
import type { LessonId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  lessonName: LessonId;
} & React.ComponentProps<typeof Button>;

const NextLessonButton: FC<Props> = ({ lessonName, className, ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      e.preventDefault();
      setIsLoading(true);
      try {
        await props.onClick(e);
      } finally {
        setIsLoading(false);
      }
    }
    navigate({
      to: '/app/levels/$id/$day/$lessonName',
      params: { ...params, lessonName },
    });
  };

  return (
    <Button
      variant={'outline-primary'}
      className={cn('self-end', className)}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="animate-pulse">{t('Global.processing')}...</span>
      ) : (
        <>
          {t('Global.next')} - {t(`Global.sidebarItems.${lessonName}`)}
        </>
      )}
    </Button>
  );
};

export default NextLessonButton;
