/// <reference types="vitest/config" />
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The file: dependency on design-system brings its own node_modules/react along;
// alias both entry points to this app's copy so hooks see a single React.
const dedupeReact = {
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: dedupeReact,
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
