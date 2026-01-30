/* eslint-disable no-unused-vars */
import { create } from 'zustand';
type AudioState = {
  audios: Map<
    string,
    {
      isPlaying: boolean;
      audioElement: HTMLAudioElement | null;
    }
  >;
  register: (id: string, audioElement: HTMLAudioElement) => void;
  unregister: (id: string) => void;
  playExclusive: (id: string) => void;
  reset: (id: string) => void;
  getAudioState: (
    id: string
  ) =>
    | { isPlaying: boolean; audioElement: HTMLAudioElement | null }
    | undefined;
};
export const useAudiosStore = create<AudioState>((set, get) => ({
  audios: new Map<
    string,
    {
      isPlaying: boolean;
      audioElement: HTMLAudioElement | null;
    }
  >(),
  register: (id: string, audioElement: HTMLAudioElement) => {
    set((state) => {
      const newAudio = new Map(state.audios);
      audioElement.onended = () => get().reset(id);
      newAudio.set(id, { isPlaying: false, audioElement });
      return { audios: newAudio };
    });
  },
  unregister: (id: string) => {
    set((state) => {
      const newAudio = new Map(state.audios);
      newAudio.get(id)?.audioElement?.pause();
      newAudio.delete(id);
      return { audios: newAudio };
    });
  },
  playExclusive(id) {
    set((state) => {
      const newAudios = new Map(state.audios);
      for (const [key, audio] of newAudios) {
        if (key === id && !audio.isPlaying) {
          audio.isPlaying = true;
          audio.audioElement?.play();
        } else {
          audio.isPlaying = false;
          audio.audioElement?.pause();
        }
      }
      return { audios: newAudios };
    });
  },
  getAudioState(id) {
    return get().audios.get(id);
  },
  reset: (id: string) => {
    set((state) => {
      const newAudios = new Map(state.audios);
      newAudios.forEach((audio, key) => {
        if (key === id) {
          audio.isPlaying = false;
          audio.audioElement?.pause();
        }
      });
      return { audios: newAudios };
    });
  },
}));
