import { defineConfig } from '@playwright/test'

export default defineConfig({
  globalSetup: './src/e2e/global-setup.ts',
  testDir: 'src/e2e',
  webServer: {
    url: 'http://localhost:5173', // your Vite/React app
    command: 'npm run dev',       // frontend command
    timeout: 10_000,
    reuseExistingServer: true
  }
})