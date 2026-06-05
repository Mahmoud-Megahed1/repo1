/* eslint-disable no-unused-vars */
import * as Icons from '@/components/shared/icons';
import { LessonsId } from '@/types/global.types';
import { LucideIcon } from 'lucide-react';

export const LEVELS_ID = [
  'LEVEL_A1',
  'LEVEL_A2',
  'LEVEL_B1',
  'LEVEL_B2',
  'LEVEL_C1',
  'LEVEL_C2',
  'LEVEL_C3',
  'LEVEL_C4',
  'LEVEL_D1',
  'LEVEL_D2',
  'LEVEL_E1',
  'LEVEL_E2',
] as const;

export const LEVELS_LABELS: Record<string, string> = {
  LEVEL_A1: 'A1',
  LEVEL_A2: 'A2',
  LEVEL_B1: 'B1',
  LEVEL_B2: 'B2',
  LEVEL_C1: 'C1',
  LEVEL_C2: 'C2',
  LEVEL_C3: 'C3',
  LEVEL_C4: 'C4',
  LEVEL_D1: 'D1',
  LEVEL_D2: 'D2',
  LEVEL_E1: 'E1',
  LEVEL_E2: 'E2',
};

export const LESSONS_LINKS: Array<{
  href: string;
  label: string;
  isActive?: boolean;
  id: LessonsId;
  icon: LucideIcon;
}> = [
  { id: 'READ', href: '#', label: 'Reading', icon: Icons.BookOpenText },
    { id: 'PICTURES', href: '#', label: 'Pictures', icon: Icons.Image },
    { id: 'LISTEN', href: '#', label: 'Listening', icon: Icons.Ear },
    { id: 'WRITE', href: '#', label: 'Writing', icon: Icons.PencilLine },
    { id: 'SPEAK', href: '#', label: 'Speaking', icon: Icons.Speech },
    { id: 'TODAY', href: '#', label: "Today's Scene", icon: Icons.Calendar },
    { id: 'Q_A', href: '#', label: 'Q&A', icon: Icons.MessageCircleQuestion },
    { id: 'GRAMMAR', href: '#', label: 'Grammar', icon: Icons.ListChecks },
    {
      id: 'PHRASAL_VERBS',
      href: '#',
      label: 'Phrasal Verbs',
      icon: Icons.CaseSensitive,
    },
    { id: 'IDIOMS', href: '#', label: 'Idioms', icon: Icons.Search },
    { id: 'DAILY_TEST', href: '#', label: 'Daily Test', icon: Icons.NotebookPen },
  ];

export enum LevelIdEnum {
  LEVEL_A1 = 'LEVEL_A1',
  LEVEL_A2 = 'LEVEL_A2',
  LEVEL_B1 = 'LEVEL_B1',
  LEVEL_B2 = 'LEVEL_B2',
  LEVEL_C1 = 'LEVEL_C1',
  LEVEL_C2 = 'LEVEL_C2',
  LEVEL_C3 = 'LEVEL_C3',
  LEVEL_C4 = 'LEVEL_C4',
  LEVEL_D1 = 'LEVEL_D1',
  LEVEL_D2 = 'LEVEL_D2',
  LEVEL_E1 = 'LEVEL_E1',
  LEVEL_E2 = 'LEVEL_E2',
}

export enum LessonIdEnum {
  READ = 'READ',
  WRITE = 'WRITE',
  SPEAK = 'SPEAK',
  TODAY = 'TODAY',
  LISTEN = 'LISTEN',
  GRAMMAR = 'GRAMMAR',
  PICTURES = 'PICTURES',
  Q_A = 'Q_A',
  DAILY_TEST = 'DAILY_TEST',
  PHRASAL_VERBS = 'PHRASAL_VERBS',
  IDIOMS = 'IDIOMS',
}

export const SECTIONS = [
  'howItWorks',
  'features',
  'testimonials',
  'faq',
] as const;
