import { configuredBasePath } from './scripts/config.mjs';
import { defineConfig, devices } from '@playwright/test';

const basePath = configuredBasePath();

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: `http://127.0.0.1:3000${basePath}/`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/preview.mjs',
    url: `http://127.0.0.1:3000${basePath}/docs/`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
