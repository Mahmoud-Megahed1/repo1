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
] as const;

export const LEVELS_LABELS = {
  LEVEL_A1: 'A1',
  LEVEL_A2: 'A2',
  LEVEL_B1: 'B1',
  LEVEL_B2: 'B2',
  LEVEL_C1: 'C1',
  LEVEL_C2: 'C2',
} as const;

export const LESSONS_LINKS: Array<{
  href: string;
  label: string;
  isActive?: boolean;
  id: LessonsId;
  icon: LucideIcon;
}> = [
    { id: 'READ', href: '#', label: 'Read', icon: Icons.BookOpenText },
    { id: 'PICTURES', href: '#', label: 'Pictures', icon: Icons.Image },
    { id: 'Q_A', href: '#', label: 'Q&A', icon: Icons.MessageCircleQuestion },
    { id: 'GRAMMAR', href: '#', label: 'Grammar', icon: Icons.ListChecks },
    { id: 'LISTEN', href: '#', label: 'Listen', icon: Icons.Ear },
    // { id: 'TODAY', href: '#', label: 'Today', icon: Icons.Calendar },
    { id: 'WRITE', href: '#', label: 'Write', icon: Icons.PencilLine },
    { id: 'SPEAK', href: '#', label: 'Speak', icon: Icons.Speech },
    { id: 'TODAY', href: '#', label: 'Today', icon: Icons.Calendar },
    { id: 'DAILY_TEST', href: '#', label: 'Daily Test', icon: Icons.NotebookPen },
    {
      id: 'PHRASAL_VERBS',
      href: '#',
      label: 'Phrasal Verbs',
      icon: Icons.CaseSensitive,
    },
    { id: 'IDIOMS', href: '#', label: 'Idioms', icon: Icons.Search },
  ];

export enum LevelIdEnum {
  LEVEL_A1 = 'LEVEL_A1',
  LEVEL_A2 = 'LEVEL_A2',
  LEVEL_B1 = 'LEVEL_B1',
  LEVEL_B2 = 'LEVEL_B2',
  LEVEL_C1 = 'LEVEL_C1',
  LEVEL_C2 = 'LEVEL_C2',
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
