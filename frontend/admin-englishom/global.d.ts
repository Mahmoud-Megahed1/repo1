/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction } from 'react';
import { TranslationSchema } from '@/types/translation.types';

export type Messages = TranslationSchema;

declare global {
  interface IntlMessages extends Messages {}
  interface Window {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  }
}
