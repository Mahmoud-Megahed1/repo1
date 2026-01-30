import { useCallback, useEffect, useReducer, useRef } from 'react';

const useAudioPlayer = (
  initialState: Partial<Omit<AudioPlayerState, 'isPlaying' | 'duration'>> = {
    currentTime: 0,
    volume: 100,
    isMuted: false,
  }
) => {
  const [{ isMuted, isPlaying, currentTime, duration, volume }, dispatch] =
    useReducer(reducer, {
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      volume: 100,
      ...initialState,
    });
  const ref = useRef<HTMLAudioElement>(null);

  const play = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.play();
    dispatch({ type: 'SET_IS_PLAYING', payload: true });
  }, []);

  const pause = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.pause();
    dispatch({ type: 'SET_IS_PLAYING', payload: false });
  }, []);

  const mute = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.muted = true;
    dispatch({ type: 'SET_IS_MUTED', payload: true });
  }, []);

  const unmute = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.muted = false;
    dispatch({ type: 'SET_IS_MUTED', payload: false });
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const setCurrentTime = useCallback(
    (value: number) => {
      const audio = ref.current;
      if (!audio) return;

      const newTime = (value / 100) * duration;
      audio.currentTime = newTime;
      dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
    },
    [duration]
  );

  const setVolume = useCallback((value: number) => {
    const audio = ref.current;
    if (!audio) return;
    dispatch({ type: 'SET_VOLUME', payload: value });
    audio.volume = value / 100;
  }, []);

  const resetAudio = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    audio.muted = false;
    dispatch({ type: 'RESET' });
  }, []);

  const handleMute = useCallback(() => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [isMuted, mute, unmute]);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const updateTime = () =>
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    const updateDuration = () => {
      if (audio.duration === Infinity) {
        audio.currentTime = Number.MAX_SAFE_INTEGER;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          dispatch({ type: 'SET_DURATION', payload: audio.currentTime });
          audio.currentTime = 0;
        };
      } else {
        dispatch({ type: 'SET_DURATION', payload: audio.duration });
      }
    };
    const handleEnded = () => {
      dispatch({ type: 'SET_IS_PLAYING', payload: false });
      dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return {
    ref,
    togglePlay,
    setCurrentTime,
    setVolume,
    resetAudio,
    handleMute,
    play,
    pause,
    mute,
    unmute,
    isMuted,
    isPlaying,
    currentTime,
    duration,
    volume,
  };
};

type AudioPlayerState = {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
};

type Action =
  | {
      type: 'SET_IS_PLAYING' | 'SET_IS_MUTED';
      payload: boolean;
    }
  | {
      type: 'SEEK' | 'SET_CURRENT_TIME' | 'SET_DURATION' | 'SET_VOLUME';
      payload: number;
    }
  | {
      type: 'RESET';
    };

function reducer(state: AudioPlayerState, action: Action): AudioPlayerState {
  switch (action.type) {
    case 'RESET':
      return {
        ...state,
        isPlaying: false,
        isMuted: false,
        currentTime: 0,
        volume: 100,
      };
    case 'SET_IS_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_IS_MUTED':
      return {
        ...state,
        isMuted: action.payload,
        volume: action.payload ? 0 : 100,
      };
    case 'SEEK':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
}

export default useAudioPlayer;
