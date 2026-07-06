/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // @you1anna/design-system declares react/react-dom as peers and ships no
    // node_modules, so this app already resolves a single React. dedupe keeps
    // that guarantee and guards the duplicate-React "Invalid hook call" failure.
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    setupFiles: ['./src/vitest.setup.ts'],
    globals: true,
    server: {
      deps: {
        inline: [/design-system/, /@radix-ui/],
      },
    },
  },
});
