import { create } from 'zustand';

type LessonProgressStore = {
  currentIndex: number;
  total: number;
  // eslint-disable-next-line no-unused-vars
  setProgress: (currentIndex: number, total: number) => void;
  resetProgress: () => void;
};

export const useLessonProgressStore = create<LessonProgressStore>((set) => ({
  currentIndex: 0,
  total: 0,
  setProgress: (currentIndex, total) => set({ currentIndex, total }),
  resetProgress: () => set({ currentIndex: 0, total: 0 }),
}));
