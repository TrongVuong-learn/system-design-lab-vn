import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', channel: 'chromium' },
  projects: [
    { name: 'mobile-chromium', testIgnore: /responsive-matrix/, use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop-chromium',
      testIgnore: /responsive-matrix/,
      use: { ...devices['Desktop Chrome'] },
    },
    { name: 'responsive-chromium', testMatch: /responsive-matrix/, use: { hasTouch: true } },
  ],
  webServer: {
    command: 'pnpm preview --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env['CI'],
  },
});
