import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { buildOffline } from '../../scripts/offline';
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sdl-offline-pack',
      apply: 'build',
      async closeBundle() {
        await buildOffline(resolve(import.meta.dirname, '../../dist'));
      },
    },
  ],
  build: { outDir: '../../dist', emptyOutDir: true },
  server: { fs: { allow: ['../..'] } },
});
