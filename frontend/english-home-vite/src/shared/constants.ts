import i18next from 'i18next';
import {
  Book,
  Calendar,
  CaseSensitive,
  Ear,
  Home,
  Image,
  Library,
  ListChecks,
  MessageCircleQuestion,
  NotebookPen,
  PencilLine,
  Search,
  Speech,
} from 'lucide-react';
import type { LevelId, SidebarItem } from './types/entities';

export const LEVEL_IDS = [
  'LEVEL_A1',
  'LEVEL_A2',
  'LEVEL_B1',
  'LEVEL_B2',
  'LEVEL_C1',
  'LEVEL_C2',
] as const;

export const MAIN_SIDEBAR_ITEMS = (): Array<SidebarItem> => [
  {
    title: i18next.t('Global.sidebarItems.home'),
    url: '/app',
    icon: Home,
    id: 'Home',
  },
  {
    title: i18next.t('Global.sidebarItems.levels'),
    url: '/app/levels',
    icon: Library,
    id: 'Levels',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFunction = (key: string) => string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultT: TFunction = (key: string) => i18next.t(key as any) as string;

export const LESSONS_SIDEBAR_DEFAULT_ITEMS = (
  levelId: LevelId = 'LEVEL_A1',
  day: string | number = '1',
  t: TFunction = defaultT
): Array<SidebarItem> => {
  const baseRoute = `/app/levels/${levelId}/${day}`;
  return [
    {
      title: t('Global.sidebarItems.READ'),
      icon: Book,
      id: 'READ',
      url: `${baseRoute}/READ` as never,
    },
    {
      title: t('Global.sidebarItems.PICTURES'),
      icon: Image,
      id: 'PICTURES',
      url: `${baseRoute}/PICTURES` as never,
    },
    {
      title: t('Global.sidebarItems.LISTEN'),
      icon: Ear,
      id: 'LISTEN',
      url: `${baseRoute}/LISTEN` as never,
    },
    {
      title: t('Global.sidebarItems.WRITE'),
      icon: PencilLine,
      id: 'WRITE',
      url: `${baseRoute}/WRITE` as never,
    },
    {
      title: t('Global.sidebarItems.SPEAK'),
      icon: Speech,
      id: 'SPEAK',
      url: `${baseRoute}/SPEAK` as never,
    },
    {
      title: t('Global.sidebarItems.TODAY'),
      icon: Calendar,
      id: 'TODAY',
      url: `${baseRoute}/TODAY` as never,
    },
    {
      title: t('Global.sidebarItems.Q_A'),
      icon: MessageCircleQuestion,
      id: 'Q_A',
      url: `${baseRoute}/Q_A` as never,
    },
    {
      title: t('Global.sidebarItems.GRAMMAR'),
      icon: ListChecks,
      id: 'GRAMMAR',
      url: `${baseRoute}/GRAMMAR` as never,
    },
    {
      title: t('Global.sidebarItems.PHRASAL_VERBS'),
      icon: CaseSensitive,
      id: 'PHRASAL_VERBS',
      url: `${baseRoute}/PHRASAL_VERBS` as never,
    },
    {
      title: t('Global.sidebarItems.IDIOMS'),
      icon: Search,
      id: 'IDIOMS',
      url: `${baseRoute}/IDIOMS` as never,
    },
    {
      title: t('Global.sidebarItems.DAILY_TEST'),
      icon: NotebookPen,
      id: 'DAILY_TEST',
      url: `${baseRoute}/DAILY_TEST` as never,
    },
  ];
};

export const LESSONS_IDS = [
  'READ',
  'WRITE',
  'LISTEN',
  'GRAMMAR',
  'PICTURES',
  'TODAY',
  'Q_A',
  'SPEAK',
  'DAILY_TEST',
  'PHRASAL_VERBS',
  'IDIOMS',
] as const;

export const SIDEBAR_ITEMS_IDS = ['Home', 'Levels', ...LESSONS_IDS] as const;

export const CONTACT_INFO = {
  support: 'support@englishom.com',
  info: 'info@englishom.com',
  billing: 'billing@englishom.com',
  admin: 'admin@englishom.com',
};
