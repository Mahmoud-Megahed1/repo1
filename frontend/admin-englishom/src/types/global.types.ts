import { LevelId } from './user.types';

export type LessonsId =
  | 'READ'
  | 'WRITE'
  | 'LISTEN'
  | 'GRAMMAR'
  | 'PICTURES'
  | 'TODAY'
  | 'Q_A'
  | 'SPEAK'
  | 'DAILY_TEST'
  | 'PHRASAL_VERBS'
  | 'IDIOMS';

export type LevelType = {
  id: string;
  level_name: LevelId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  isAvailable: boolean;
};

export type ExcludeAriaAttributes<T> = {
  [K in keyof T as K extends `aria-${string}` ? never : K]: T[K];
};

export type FormInputsType = ExcludeAriaAttributes<
  React.InputHTMLAttributes<HTMLInputElement>
> & {
  label: string;
};

export type WithPagination<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
