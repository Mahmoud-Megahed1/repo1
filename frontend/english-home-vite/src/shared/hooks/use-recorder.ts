import { convertWebmToWav } from '@lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  audioURL: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioFile: File | null;
  timer: number;
  toggleRecording: () => Promise<void>;
}

const useRecorder = (options?: {
  maxDurationInSeconds?: number;
  // eslint-disable-next-line no-unused-vars
  onStop?: (audioFile: File | null) => void;
}): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const { t } = useTranslation();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const clearTimers = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (timerTimeoutRef.current) {
      clearTimeout(timerTimeoutRef.current);
      timerTimeoutRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearTimers();
  };

  const startRecording = async (): Promise<void> => {
    try {
      // clear previous state
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }
      setAudioFile(null);
      audioChunksRef.current = [];
      setTimer(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setIsRecording(true);

      // timer increment
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      // max duration auto stop
      if (options?.maxDurationInSeconds) {
        timerTimeoutRef.current = setTimeout(() => {
          stopRecording();
        }, options.maxDurationInSeconds * 1000);
      }

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        clearTimers();
        const type = mediaRecorder.mimeType.split(';')[0] || 'audio/wav';
        const format = type.split('/')[1];
        const audioBlob = new Blob(audioChunksRef.current, {
          type,
        });
        audioChunksRef.current = [];

        let file = new File([audioBlob], `recording-${Date.now()}.${format}`, {
          type,
        });

        file = await convertWebmToWav(file);

        setAudioFile(file);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        streamRef.current = null;

        // call callback
        if (options?.onStop) {
          options.onStop(file);
        }
      };
    } catch (err) {
      toast.error(t('Global.errorMessages.microphoneDenied.message'));
      console.error('Error accessing microphone:', err);
      setIsRecording(false);
      clearTimers();
    }
  };

  const toggleRecording = async (): Promise<void> => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    timer,
    toggleRecording,
    audioFile,
  };
};

export default useRecorder;
