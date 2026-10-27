import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { buildOffline } from '../../scripts/offline';
// Preview enforces the production security policy so browser QA catches CSP regressions.
const hosting = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const securityHeaders = hosting.headers.find((rule) => rule.source === '/(.*)')!.headers;
export default defineConfig({
  preview: { headers: Object.fromEntries(securityHeaders.map(({ key, value }) => [key, value])) },
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
