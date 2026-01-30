import { cn } from '@lib/utils';
import { Input } from '@ui/input';
import { useEffect, useState } from 'react';

const CompleteSentence = ({
  sentence,
  values,
  defaultValues = [],
  onValuesChange,
  isChecked = false,
}: {
  sentence: string;
  values?: string[];
  defaultValues?: string[];
  // eslint-disable-next-line no-unused-vars
  onValuesChange?: (values: string[]) => void;
  isChecked?: boolean;
}) => {
  const parts = sentence.split(/({[^}]*})/g).filter(Boolean);

  const [localValues, setLocalValues] = useState<string[]>(defaultValues);

  useEffect(() => {
    setLocalValues(defaultValues);
  }, [defaultValues]);

  const effectiveValues = values ?? localValues;

  const updateValues = (newValues: string[]) => {
    if (values) {
      onValuesChange?.(newValues);
    } else {
      setLocalValues(newValues);
      onValuesChange?.(newValues);
    }
  };

  const handleChange = (val: string, idx: number) => {
    const updated = [...effectiveValues];
    updated[idx] = val;
    updateValues(updated);
  };

  let blankCounter = 0;

  return (
    <p className="flex flex-wrap items-center gap-2 text-base">
      {parts.map((part, i) => {
        const isBlank = /^\{[^}]*\}$/.test(part);
        if (!isBlank) return <span key={i}>{part}</span>;

        const idx = blankCounter++;
        const correct = part.slice(1, -1).trim();
        const userVal = effectiveValues[idx] ?? '';
        const normalizedUser = userVal.trim().toLowerCase();
        const normalizedCorrect = correct.toLowerCase();

        const isUserCorrect = isChecked && normalizedUser === normalizedCorrect;
        const isUserWrong = isChecked && normalizedUser !== normalizedCorrect;

        return (
          <Input
            key={i}
            value={userVal}
            onPaste={(e) => e.preventDefault()}
            onChange={(e) => handleChange(e.target.value, idx)}
            placeholder="..."
            className={cn(
              'border-primary/80 focus-visible:ring-offset-accent w-24 border-2 border-dashed text-center focus-visible:ring-offset-2',
              {
                'border-green-500': isUserCorrect,
                'border-destructive': isUserWrong,
              }
            )}
          />
        );
      })}
    </p>
  );
};

export default CompleteSentence;
