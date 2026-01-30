import { ThemeProvider } from '@components/contexts/theme-context';
import DefaultErrorComponent from '@components/default-error-component';
import DefaultNotFoundComponent from '@components/default-not-found-component';
import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { toast } from 'sonner';
import { routeTree } from './routeTree.gen';
import './shared/i18n';
import './styles/index.css';

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultNotFoundComponent: () => <DefaultNotFoundComponent />,
  defaultErrorComponent: DefaultErrorComponent,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      placeholderData: keepPreviousData,
      throwOnError: true,
    },
    mutations: {
      onError: (error) => {
        toast.error(error.response?.data.message || 'Something went wrong');
      },
    },
  },
});

// For TanStack Query Devtools extension in the browser
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
