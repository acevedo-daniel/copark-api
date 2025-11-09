import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Archivos ignorados
  {
    ignores: ['node_modules/**', 'lib/**', '.firebase/**', 'coverage/**', '*.config.js'],
  },

  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
    plugins: {
      'import-x': importX,
    },
    rules: {
      // Import rules
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',

      // Buenas prácticas generales
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',

      // Desactiva reglas en conflicto con Prettier
      ...eslintConfigPrettier.rules,
    },
  },
];
