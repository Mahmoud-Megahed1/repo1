import type { LocalizedRouteType } from '@shared/types/utils';
import { create } from 'zustand';

export type BreadcrumbItemType =
  | {
      label: string;
      href?: LocalizedRouteType;
      isCurrent?: boolean;
      type?: 'default';
    }
  | {
      type: 'dropDownMenu';
      items: Array<BreadcrumbItemType>;
      label: string;
      href?: LocalizedRouteType;
      isCurrent?: boolean;
    };

type BreadcrumbStore = {
  items: Array<BreadcrumbItemType>;
  // eslint-disable-next-line no-unused-vars
  setItems: (items: Array<BreadcrumbItemType>) => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  items: [
    {
      label: 'Home',
      href: '/app',
      isCurrent: true,
    },
  ],
  setItems: (items) => set({ items }),
}));
