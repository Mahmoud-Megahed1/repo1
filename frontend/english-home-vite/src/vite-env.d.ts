/// <reference types="vite/client" />

import * as React from 'react';
import 'i18next';
import type { TFunction } from 'i18next';
import { router } from './main';
import type { TranslationType } from '@shared/i18n/translation.type';
import type { AxiosError } from 'axios';
import type { QueryClient } from '@tanstack/query-core';

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
  }

  namespace JSX {
    interface IntrinsicElements {
      'tamara-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        type?: string;
        amount?: string;
        'inline-type'?: string;
        class?: string;
      };
    }
  }
}

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }

  namespace JSX {
    interface IntrinsicElements {
      'tamara-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        type?: string;
        amount?: string;
        'inline-type'?: string;
        class?: string;
      };
    }
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

declare module 'i18next' {
  interface i18n {
    changeLanguage(
      lng?: 'ar' | 'en',
      callback?: Callback | undefined
    ): Promise<TFunction>;
  }

  interface CustomTypeOptions {
    defaultNS: 'ar';
    resources: {
      ar: TranslationType;
      en: TranslationType;
    };
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<{ message: string }>;
  }
}
