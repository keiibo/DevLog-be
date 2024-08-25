import globals from 'globals';
import typeScriptESLintParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  { files: ['**/*.{ts,tsx}'] },
  eslintConfigPrettier,
  ...compat.extends('prettier'),
  {
    languageOptions: {
      globals: globals.browser,
      parser: typeScriptESLintParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    },
    rules: {
      'no-console': 'error'
    }
  }
];
