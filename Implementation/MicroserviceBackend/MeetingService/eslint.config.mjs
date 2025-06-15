// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default[
  {
    ignores: ['dist/**', 'node_modules/**'], // your ignore paths here
  },
  ...tseslint.config(
  eslint.configs.recommended, 
  tseslint.configs.recommended,
)];