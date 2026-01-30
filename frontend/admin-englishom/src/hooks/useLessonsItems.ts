import { LESSONS_LINKS } from '@/constants';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const useLessonsItems = () => {
  const t = useTranslations('Global.sidebar.lessons');
  const items = useMemo(
    () =>
      LESSONS_LINKS.map((item) => ({
        ...item,
        label: t(item.id),
      })),
    [t],
  );
  return items;
};

export default useLessonsItems;
