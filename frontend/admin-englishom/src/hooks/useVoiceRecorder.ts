import { useState, useRef } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  audioURL: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  timer: number;
}

const useVoiceRecorder = (options?: {
  maxDurationInSeconds: number;
}): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async (): Promise<void> => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder: MediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setIsRecording(true);
      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      if (options?.maxDurationInSeconds) {
        setTimeout(() => {
          stopRecording();
        }, options.maxDurationInSeconds);
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        audioChunksRef.current = [];

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = (): void => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  return {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    timer,
    audioBlob,
  };
};

export default useVoiceRecorder;
