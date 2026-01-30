import { MAIN_SIDEBAR_ITEMS } from '@shared/constants';
import type { SidebarItem } from '@shared/types/entities';
import { create } from 'zustand';

type SidebarStore = {
  items: Array<SidebarItem>;
  // eslint-disable-next-line no-unused-vars
  setItems: (items: Array<SidebarItem>) => void;
  // eslint-disable-next-line no-unused-vars
  handleActiveItem: (id: SidebarItem['id']) => void;
  resetItems: () => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  handleActiveItem: (id: SidebarItem['id']) =>
    set((state) => ({
      items: state.items.map((item) => ({
        ...item,
        isActive: item.id === id,
      })),
    })),
  resetItems: () => set({ items: MAIN_SIDEBAR_ITEMS() }),
}));
