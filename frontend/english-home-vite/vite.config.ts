/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    reporters: ['default', 'tap-flat'],
  },
  resolve: {
    alias: {
      '@modules': path.resolve(__dirname, './src/modules'),
      '@ui': path.resolve(__dirname, './src/shared/components/ui'),
      '@lib': path.resolve(__dirname, './src/shared/lib'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],
          'vendor-libs': [
            '@tanstack/react-router',
            '@tanstack/react-query',
            'axios',
            'i18next',
            'react-i18next',
            'zustand',
            'clsx',
            'tailwind-merge',
            'lucide-react',
            'sonner'
          ],
        },
        // Optimize file names for better caching
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Improve build performance
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production for smaller builds
  },
});
