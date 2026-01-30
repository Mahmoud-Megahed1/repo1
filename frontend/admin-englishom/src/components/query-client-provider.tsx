'use client';
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      placeholderData: keepPreviousData,
    },
    mutations: {
      onError: (error) => {
        const err = error as AxiosError<{ message: string }>;
        if (err.response?.data.message) {
          toast.error(err.response?.data.message);
        }
      },
    },
  },
});
const MyQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default MyQueryClientProvider;
