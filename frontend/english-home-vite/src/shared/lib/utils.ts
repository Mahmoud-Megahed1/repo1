import type { LevelDetails, LevelId } from '@shared/types/entities';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isClient = () => typeof window !== 'undefined';
export function localizedNumber(value: number, locale = 'en-US') {
  if (locale === 'ar') locale = 'ar-EG';
  if (locale === 'en') locale = 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

export function localizeNumber(locale = 'en-US') {
  if (locale === 'ar') locale = 'ar-EG';
  if (locale === 'en') locale = 'en-US';
  return (value: number) => new Intl.NumberFormat(locale).format(value);
}

export function formatTime(time: number) {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function getLevelLabel(levelId: LevelId) {
  return levelId.split('_')[1];
}

export function maskEmail(email: string) {
  const part = email.split('@')[0];
  const domain = email.split('@')[1];
  const firstChar = part.charAt(0);
  const twoLastChar = part.slice(-2);
  const stars = '*'.repeat(part.length - 3);
  if (part.length <= 3) {
    return `${firstChar}*****@${domain}`;
  }

  return `${firstChar}${stars}${twoLastChar}@${domain}`;
}

export async function convertWebmToWav(file: File): Promise<File> {
  // Step 1: Read the .webm file as an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Step 2: Decode audio data using Web Audio API
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // Step 3: Convert AudioBuffer to WAV ArrayBuffer
  const wavBuffer = audioBufferToWav(audioBuffer);

  // Step 4: Create a File object for the WAV
  return new File([wavBuffer], file.name.replace(/\.webm$/, '.wav'), {
    type: 'audio/wav',
  });
}

// Utility: Convert AudioBuffer → WAV ArrayBuffer
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  // Combine all channel data
  const result = interleave(buffer);
  const byteRate = (sampleRate * numOfChannels * bitDepth) / 8;
  const blockAlign = (numOfChannels * bitDepth) / 8;
  const bufferLength = 44 + result.length * 2;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + result.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, result.length * 2, true);

  // Write PCM samples
  floatTo16BitPCM(view, 44, result);

  return arrayBuffer;
}

// Helpers
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function interleave(buffer: AudioBuffer): Float32Array {
  const channels = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  if (buffer.numberOfChannels === 1) {
    return channels[0];
  }

  const length = channels[0].length * buffer.numberOfChannels;
  const result = new Float32Array(length);

  let index = 0;
  for (let i = 0; i < channels[0].length; i++) {
    for (let j = 0; j < channels.length; j++) {
      result[index++] = channels[j][i];
    }
  }
  return result;
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

export function formatDate(dateString?: string | Date) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getLevelVariant({
  isAvailable,
  userLevels,
  levelId,
}: {
  userLevels: Array<LevelDetails>;
  isAvailable: boolean;
  levelId: LevelId;
}): 'unlocked' | 'locked' | 'coming-soon' | 'expired' {
  if (!isAvailable) {
    return 'coming-soon';
  }
  const targetLevel = userLevels.find((level) => level.levelName === levelId);
  if (!targetLevel) {
    return 'locked';
  }
  if (targetLevel.isExpired) {
    return 'expired';
  }
  return 'unlocked';
}

export function downloadRemoteFile({
  url,
  onLoad,
  onProgress,
}: {
  url: string;
  // eslint-disable-next-line no-unused-vars
  onProgress?: (percent: number) => void;
  onLoad?: () => void;
}) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';

  xhr.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      onProgress?.(percent);
    }
  };

  xhr.onload = () => {
    const blobUrl = URL.createObjectURL(xhr.response);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'audio.mp3';
    a.click();
    URL.revokeObjectURL(blobUrl);
    onLoad?.();
  };

  xhr.send();
}

export function oneDayBefore(date: Date | string): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
}
