import { LessonIdEnum, LevelIdEnum } from '@/constants';
import { createParser, parseAsStringEnum, useQueryStates } from 'nuqs';

const useLessonQueryParams = () => {
  return useQueryStates(
    {
      levelId: parseAsStringEnum<LevelIdEnum>(
        Object.values(LevelIdEnum),
      ).withDefault(LevelIdEnum.LEVEL_A1),
      day: parseAsDays.withDefault(1),
      lesson: parseAsStringEnum<LessonIdEnum>(
        Object.values(LessonIdEnum),
      ).withDefault(LessonIdEnum.READ),
    },
    { history: 'replace' },
  );
};

export const parseAsDays = createParser({
  parse(queryValue) {
    const day = parseInt(queryValue, 10);
    if (isNaN(day)) return null;
    return day > 0 && day <= 50 ? day : null;
  },
  serialize(value) {
    return value.toString();
  },
});

export default useLessonQueryParams;
