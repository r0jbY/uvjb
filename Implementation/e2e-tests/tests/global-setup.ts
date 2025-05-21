import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:5173');
  await page.getByPlaceholder('Email').fill('user3@example.com');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Log In' }).click();

  await page.waitForURL('**/UserOverview');
  await context.storageState({ path: 'tests/.auth/user.json' });

  

  await browser.close();
}

export default globalSetup;