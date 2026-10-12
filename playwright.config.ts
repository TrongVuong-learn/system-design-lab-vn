import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'mobile-chromium',
      testIgnore: /responsive-matrix/,
      use: { ...devices['Pixel 7'], channel: 'chromium' },
    },
    {
      name: 'desktop-chromium',
      testIgnore: /responsive-matrix/,
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    {
      name: 'responsive-chromium',
      testMatch: /responsive-matrix/,
      use: { hasTouch: true, channel: 'chromium' },
    },
    {
      name: 'desktop-firefox',
      testIgnore: /responsive-matrix/,
      use: { browserName: 'firefox', channel: undefined },
    },
    {
      name: 'desktop-webkit',
      testIgnore: /responsive-matrix/,
      use: { browserName: 'webkit', channel: undefined },
    },
  ],
  webServer: {
    command: 'pnpm preview --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env['CI'],
  },
});
