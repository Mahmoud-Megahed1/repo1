import { convertAudioToWav } from '@lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';
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
  /** Current audio input level 0-100 (for visual feedback) */
  audioLevel: number;
  /** Whether the browser supports recording at all */
  isSupported: boolean;
}

// ─── MIME Type Detection ──────────────────────────────────────
/**
 * Detect the best available audio MIME type for MediaRecorder.
 * Priority: Opus codecs (best speech quality) → AAC (Safari) → fallback.
 */
function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';

  const candidates = [
    // Opus is the gold standard for speech — used by Google Meet, Discord, etc.
    'audio/webm;codecs=opus',
    'audio/webm',
    // Safari / iOS (14.1+)
    'audio/mp4;codecs=aac',
    'audio/mp4',
    // Firefox alternative
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];

  for (const mt of candidates) {
    if (MediaRecorder.isTypeSupported(mt)) return mt;
  }

  return ''; // Let browser pick default
}

/**
 * Get the file extension from a MIME type string.
 */
function getExtensionFromMime(mimeType: string): string {
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  return 'audio';
}

// ─── Audio Constraints ──────────────────────────────────────
/**
 * Build the best audio constraints for speech recording.
 * These settings optimize for clear voice capture:
 * - 48kHz sample rate (professional broadcast quality)
 * - Mono channel (speech doesn't need stereo)
 * - Echo cancellation + noise suppression + auto gain
 */
function getAudioConstraints(): MediaTrackConstraints {
  return {
    // 48kHz = broadcast/professional quality (higher than CD quality 44.1kHz)
    sampleRate: { ideal: 48000, min: 16000 },
    // Mono is ideal for speech — reduces file size, no quality loss
    channelCount: { ideal: 1 },
    // Post-processing for clean speech
    echoCancellation: { ideal: true },
    noiseSuppression: { ideal: true },
    autoGainControl: { ideal: true },
  };
}

// ─── Browser Support Check ──────────────────────────────────────
function checkBrowserSupport(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices !== 'undefined' &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof MediaRecorder !== 'undefined'
  );
}

// ─── Main Hook ──────────────────────────────────────
const useRecorder = (options?: {
  maxDurationInSeconds?: number;
  // eslint-disable-next-line no-unused-vars
  onStop?: (audioFile: File | null) => void;
}): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const { t } = useTranslation();

  const isSupported = checkBrowserSupport();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (timerTimeoutRef.current) {
      clearTimeout(timerTimeoutRef.current);
      timerTimeoutRef.current = null;
    }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  const releaseStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  /**
   * Start real-time audio level monitoring.
   * Updates `audioLevel` (0-100) for visual feedback (waveform, VU meter, etc.)
   */
  const startAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate RMS (Root Mean Square) for accurate level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        // Normalize to 0-100 range
        const level = Math.min(100, Math.round((rms / 128) * 100));
        setAudioLevel(level);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch {
      // Audio analysis is non-critical — continue recording without it
      console.warn('Audio level analysis not available');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearTimers();
    stopAudioAnalysis();
    releaseStream();
  }, [clearTimers, stopAudioAnalysis, releaseStream]);

  const startRecording = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      toast.error(
        t('Global.errorMessages.microphoneDenied.message',
          'Your browser does not support audio recording. Please use Chrome, Firefox, Safari, or Edge.')
      );
      return;
    }

    try {
      // Clear previous state
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }
      setAudioFile(null);
      audioChunksRef.current = [];
      setTimer(0);

      // Request high-quality audio with processing
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: getAudioConstraints(),
      });
      streamRef.current = stream;

      // Start audio level monitoring
      startAudioAnalysis(stream);

      // Detect best MIME type for this browser
      const mimeType = getSupportedMimeType();
      const recorderOptions: MediaRecorderOptions = {};

      if (mimeType) {
        recorderOptions.mimeType = mimeType;
        // 128kbps — clear speech without large file sizes
        recorderOptions.audioBitsPerSecond = 128000;
      }

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;

      // Collect data every 250ms for smoother processing
      mediaRecorder.start(250);
      setIsRecording(true);

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      // Auto-stop at max duration
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
        stopAudioAnalysis();
        releaseStream();

        const actualMimeType = mediaRecorder.mimeType || mimeType || 'audio/wav';
        const extension = getExtensionFromMime(actualMimeType);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: actualMimeType,
        });
        audioChunksRef.current = [];

        let file = new File([audioBlob], `recording-${Date.now()}.${extension}`, {
          type: actualMimeType,
        });

        // Convert to WAV for universal backend compatibility
        try {
          file = await convertAudioToWav(file);
        } catch (conversionError) {
          console.warn('WAV conversion failed, using original format:', conversionError);
        }

        setAudioFile(file);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        if (options?.onStop) {
          options.onStop(file);
        }
      };

      mediaRecorder.onerror = () => {
        toast.error(
          t('Global.errorMessages.microphoneDenied.message',
            'Recording failed. Please check your microphone and try again.')
        );
        stopRecording();
      };
    } catch (err: unknown) {
      // Provide specific error messages based on the failure reason
      const error = err as DOMException;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error(
          t('Global.errorMessages.microphoneDenied.message',
            'Microphone access denied. Please allow microphone access in your browser settings.')
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast.error('No microphone detected. Please connect a microphone and try again.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        toast.error('Microphone is in use by another application. Please close it and try again.');
      } else {
        toast.error(
          t('Global.errorMessages.microphoneDenied.message',
            'Could not start recording. Please check your microphone.')
        );
      }
      console.error('Error accessing microphone:', err);
      setIsRecording(false);
      clearTimers();
      stopAudioAnalysis();
      releaseStream();
    }
  }, [isSupported, audioURL, options, t, startAudioAnalysis, stopRecording, clearTimers, stopAudioAnalysis, releaseStream]);

  const toggleRecording = useCallback(async (): Promise<void> => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      clearTimers();
      stopAudioAnalysis();
      releaseStream();
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
    audioLevel,
    isSupported,
  };
};

export default useRecorder;
