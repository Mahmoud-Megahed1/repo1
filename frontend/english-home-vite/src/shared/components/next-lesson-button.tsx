import { cn } from '@lib/utils';
import { Link } from '@shared/i18n/routing';
import type { LessonId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import type React from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
type Props = {
  lessonName: LessonId;
} & React.ComponentProps<typeof Button>;
const NextLessonButton: FC<Props> = ({ lessonName, className, ...props }) => {
  const { t } = useTranslation();
  const params = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  return (
    <Button
      variant={'outline-primary'}
      className={cn('self-end', className)}
      asChild
      {...props}
    >
      <Link
        to="/app/levels/$id/$day/$lessonName"
        params={{ ...params, lessonName }}
      >
        {t('Global.next')} - {t(`Global.sidebarItems.${lessonName}`)}
      </Link>
    </Button>
  );
};

export default NextLessonButton;
