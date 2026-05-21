'use client';

import { LevelIdEnum } from '@/constants';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import React from 'react';
import CustomSelect from '../ui/custom-select';
import { useTranslations } from 'next-intl';
type Props = {
  levelId: LevelIdEnum;
  day: number;
  setParams: ReturnType<typeof useLessonQueryParams>['1'];
};
const LevelAndDaySelector: React.FC<Props> = ({ levelId, day, setParams }) => {
  const t = useTranslations('Admin.cms');
  return (
    <div className="flex gap-4">
      <CustomSelect
        defaultValue={levelId}
        onValueChange={(val) => setParams({ levelId: val as LevelIdEnum })}
        label={t('level')}
        options={Object.entries(LevelIdEnum).map(([key, value]) => ({
          value: key,
          label: value.split('_')[1],
        }))}
      />
      <CustomSelect
        defaultValue={`${day}`}
        onValueChange={(val) => setParams({ day: +val })}
        label={t('day')}
        options={Array.from({ length: 50 }).map((_, i) => ({
          value: `${i + 1}`,
          label: `${i + 1}`,
        }))}
      />
    </div>
  );
};

export default LevelAndDaySelector;
