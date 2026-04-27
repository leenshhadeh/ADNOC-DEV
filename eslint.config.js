import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ── TypeScript ────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'warn', // flag any usage, don't block
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

      // ── React ─────────────────────────────────────────────────
      'react/self-closing-comp': 'warn', // <Foo></Foo> → <Foo />
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-array-index-key': 'warn', // prefer stable keys
      'react/display-name': 'off', // arrow components are fine

      // ── General best practices ────────────────────────────────
      'no-console': 'warn', // no console.log in production code
      'no-debugger': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['warn', 'always', { null: 'ignore' }], // prefer === but allow == null
    },
  },
  // Relax rules for test files
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'src/test/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
])
