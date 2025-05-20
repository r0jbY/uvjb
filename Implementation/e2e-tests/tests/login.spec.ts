import { test, expect } from '@playwright/test';

test('should display message for invalid/no email', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByText('Invalid email format')).toBeVisible();
});

test('should display message for invalid/no password', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('r.balint@gmail.com');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByText('Password is too short.')).toBeVisible();
});

test('should display message for wrong credentials', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('r.balint@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('should not let a non-admin user login in', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('user1@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByText('Access denied')).toBeVisible();
});

test('should redirect to UserOverview page on correct login', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('user3@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL(/.*\/UserOverview$/);
});

