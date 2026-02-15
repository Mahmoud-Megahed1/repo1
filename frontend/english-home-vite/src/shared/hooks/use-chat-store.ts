import { create } from 'zustand';

type ChatStore = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggle: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
