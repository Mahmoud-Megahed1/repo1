'use client';

import { LessonIdEnum } from '@/constants';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { lessonComponents } from './lessons-components';

const AdminPage = () => {
  const [lesson] = useQueryState(
    'lesson',
    parseAsStringEnum<LessonIdEnum>(Object.values(LessonIdEnum)).withDefault(
      LessonIdEnum.READ,
    ),
  );
  const CurrentComponent = useMemo(() => lessonComponents[lesson], [lesson]);
  return <CurrentComponent />;
};

export default AdminPage;
