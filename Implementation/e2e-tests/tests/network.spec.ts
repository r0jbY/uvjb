// tests/Network.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
test.use({ storageState: 'tests/.auth/user.json' }); // 👈 Logged-in

test.describe("Network Page tests", () => {
    test('should show network overview', async ({ page }) => {
        await page.goto('/NetworkOverview');
        await expect(page.locator('h1')).toContainText('Client Network Management');
    });

    test('should show network management after selecting client and layer', async ({ page }) => {
        await page.goto('/NetworkOverview');

        await page.goto('/NetworkOverview');
        await page.locator('.css-14oxtc6 > div:nth-child(2)').first().click();
        await page.getByRole('option', { name: 'Sophie Anderson - 12 Park' }).click();
        await page.locator('div').filter({ hasText: /^Select Layer$/ }).nth(1).click();
        await page.getByRole('option', { name: '1' }).click();
        await expect(page.getByRole('heading', { name: 'Current Network' })).toBeVisible();
    });

    test('buddies to be added and to be removed should appear as pending changes', async ({ page }) => {
        await page.goto('/NetworkOverview');
        await page.locator('div').filter({ hasText: /^Select Client$/ }).nth(1).click();
        await page.getByRole('option', { name: 'Sophie Anderson - 12 Park' }).click();
        await page.locator('div').filter({ hasText: /^Select Layer$/ }).nth(1).click();
        await page.getByRole('option', { name: '1' }).click();
        await page.locator('div').filter({ hasText: /^Liam BakkerRemove$/ }).getByRole('button').click();
        await page.locator('div:nth-child(3) > div > .flex > .bg-\\[\\#658F8D\\]').first().click();
        await expect(page.locator('div').filter({ hasText: /^Anna de BoerUndo$/ }).first()).toBeVisible();
        await page.locator('div').filter({ hasText: /^Liam BakkerUndo$/ }).first().click();
    });

    test('changes to the client network should be automatically shown to the user', async ({ page }) => {
        await page.goto('/NetworkOverview');
        await page.locator('div').filter({ hasText: /^Select Client$/ }).nth(1).click();
        await page.getByRole('option', { name: 'Sophie Anderson - 12 Park' }).click();
        await page.locator('div').filter({ hasText: /^Select Layer$/ }).nth(1).click();
        await page.getByRole('option', { name: '1' }).click();
        await page.locator('div').filter({ hasText: /^Liam BakkerRemove$/ }).getByRole('button').click();
        await page.locator('div:nth-child(3) > div > .flex > .bg-\\[\\#658F8D\\]').first().click();
        await expect(page.locator('div').filter({ hasText: /^Anna de BoerUndo$/ }).first()).toBeVisible();
        await page.locator('div').filter({ hasText: /^Liam BakkerUndo$/ }).first().click();
        await page.getByRole('button', { name: 'Commit Network Changes' }).click();
        await expect(page.getByText('Network changes submitted!')).toBeVisible();
        await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - text: Noah de Vries
    - button "Remove"
    - text: Milan Visser
    - button "Remove"
    - text: Anna de Boer
    - button "Remove"
    `);
    });


});

