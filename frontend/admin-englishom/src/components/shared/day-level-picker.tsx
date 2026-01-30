import React from 'react';
import SelectFormField from './form-fields/select-form-field';
import { LevelIdEnum } from '@/constants';
import { Control, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  control: Control<T>;
};

const DayLevelPicker = <T extends FieldValues>({ control }: Props<T>) => {
  return (
    <div className="flex gap-4">
      <SelectFormField
        name={'levelId' as Path<T>}
        options={Object.entries(LevelIdEnum).map(([key, value]) => ({
          value: key,
          label: value.split('_')[1],
        }))}
        placeholder="Select Level"
        control={control}
      />
      <SelectFormField
        name={'day' as Path<T>}
        options={Array.from({ length: 50 }).map((_, index) => ({
          value: String(index + 1),
          label: String(index + 1),
        }))}
        placeholder="Select Day"
        control={control}
      />
    </div>
  );
};

export default DayLevelPicker;
