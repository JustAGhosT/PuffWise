import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['engines/node/src/__tests__/**/*.test.mjs'],
  },
});
