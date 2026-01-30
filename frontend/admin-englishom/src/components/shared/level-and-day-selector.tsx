import { LevelIdEnum } from '@/constants';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import React from 'react';
import CustomSelect from '../ui/custom-select';
type Props = {
  levelId: LevelIdEnum;
  day: number;
  setParams: ReturnType<typeof useLessonQueryParams>['1'];
};
const LevelAndDaySelector: React.FC<Props> = ({ levelId, day, setParams }) => {
  return (
    <div className="flex gap-4">
      <CustomSelect
        defaultValue={levelId}
        onValueChange={(val) => setParams({ levelId: val as LevelIdEnum })}
        label="Level"
        options={Object.entries(LevelIdEnum).map(([key, value]) => ({
          value: key,
          label: value.split('_')[1],
        }))}
      />
      <CustomSelect
        defaultValue={`${day}`}
        onValueChange={(val) => setParams({ day: +val })}
        label="Day"
        options={Array.from({ length: 50 }).map((_, i) => ({
          value: `${i + 1}`,
          label: `${i + 1}`,
        }))}
      />
    </div>
  );
};

export default LevelAndDaySelector;
