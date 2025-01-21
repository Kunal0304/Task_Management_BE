import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

const recommendedJsConfig = pluginJs.configs.recommended;

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: true,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      // custom rules
    },
    ...recommendedJsConfig,
  },
];
