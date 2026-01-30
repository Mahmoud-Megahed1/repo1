import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import eslintI18next from 'eslint-plugin-i18next';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      eslintI18next.configs['flat/recommended'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-console': 'warn',
      'no-var': 'error',
      'no-unused-vars': 'error',
      'i18next/no-literal-string': [
        'off',
        {
          mode: 'all',
          'jsx-attributes': {
            include: ['aria-label', 'data-testid'],
          },
        },
      ],
    },
  },
]);
