import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function isClient() {
  return typeof window !== 'undefined';
}

export function isImage(file: File) {
  return file.type.startsWith('image/');
}

export function isValidImage(file: File) {
  if (!isImage(file)) {
    alert('Invalid file type. Please upload an image file.');
    return false;
  }
  return true;
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function boundedValue({ min, max }: { min: number; max: number }) {
  return function (value: number) {
    if (value > max) return max;
    else if (value < min) return min;
    else return value;
  };
}

export function omit<T extends object>(obj: T, keys: (keyof T)[]): T {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - notificationDate.getTime()) / 1000,
  );
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
