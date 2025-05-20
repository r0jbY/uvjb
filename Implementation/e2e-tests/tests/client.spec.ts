// tests/ClientOverview.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
test.use({ storageState: 'tests/.auth/user.json' }); // 👈 Logged-in

test.describe("Client Page tests", () => {
    test('should show client overview', async ({ page }) => {
        await page.goto('/ClientOverview');
        await expect(page.locator('h1')).toContainText('Client Overview');
    });

    test('should load list of all 15 clients in the db', async ({ page }) => {
        await page.goto('/ClientOverview');

        await page.waitForSelector('button:has-text("Edit")', { timeout: 10000 });
        const editButtons = page.locator('button:has-text("Edit")');
        const count = await editButtons.count();

        expect(count).toBeGreaterThan(10);
        expect(count).toBeLessThanOrEqual(20);
    });

    test('should display a client when searching for his name', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.getByRole('textbox', { name: 'Search Client name, address..' }).click();
        await page.getByRole('textbox', { name: 'Search Client name, address..' }).fill('Milan');
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.getByText('Milan Visser+3161000000634')).toBeVisible();
    });

    test('should display a message when no matching clients are found', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.getByRole('textbox', { name: 'Search Client name, address..' }).click();
        await page.getByRole('textbox', { name: 'Search Client name, address..' }).fill('non-existent');
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.getByText('No clients matching the search')).toBeVisible();
    });

    test('should display the full client list after clearing the search', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.getByRole('textbox', { name: 'Search Client name, address..' }).click();
        await page.getByRole('textbox', { name: 'Search Client name, address..' }).fill('non-existent');
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByRole('button', { name: 'Clear' }).click();

        await page.waitForSelector('button:has-text("Edit")', { timeout: 10000 });
        const editButtons = page.locator('button:has-text("Edit")');
        const count = await editButtons.count();

        expect(count).toBeGreaterThan(10);
        expect(count).toBeLessThanOrEqual(20);
    });

    test('should display a form for new client creation pressing the new Client button', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.getByRole('button', { name: 'New Client' }).click();
        await expect(page.getByRole('heading', { name: 'Create New Client' })).toBeVisible();
    });

    test('should display a message when some Client creation fields are left empty', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.getByRole('button', { name: 'New Client' }).click();
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByText('Please fill in all required')).toBeVisible();
    });

    test('should fail if device code is already in use', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.getByRole('button', { name: 'New Client' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Robert');
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Balint');
        await page.getByRole('textbox', { name: 'Device code' }).click();
        await page.getByRole('textbox', { name: 'Device code' }).fill('10101010-1010-1010-1010-101010101010');
        await page.getByRole('textbox', { name: 'Phone Number' }).click();
        await page.getByRole('textbox', { name: 'Phone Number' }).fill('+31012345678');
        await page.getByRole('textbox', { name: 'Address', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address', exact: true }).fill('Koni 25');
        await page.locator('form svg').click();
        await page.getByRole('option', { name: 'user8@example.com' }).click();
        await page.locator('select[name="active"]').selectOption('false');
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByText('Device code is already in use.')).toBeVisible();
    });

    test('should create a client when all fields are correct', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.getByRole('button', { name: 'New Client' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Robert');
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Balint');
        await page.getByRole('textbox', { name: 'Device code' }).click();
        await page.getByRole('textbox', { name: 'Device code' }).fill('c792ce32-4148-470f-925a-a2f7c4e80ec4');
        await page.getByRole('textbox', { name: 'Phone Number' }).click();
        await page.getByRole('textbox', { name: 'Phone Number' }).fill('+31012345678');
        await page.getByRole('textbox', { name: 'Address', exact: true }).click();
        await page.getByRole('textbox', { name: 'Address', exact: true }).fill('Koni 25');
        await page.locator('form svg').click();
        await page.getByRole('option', { name: 'user8@example.com' }).click();
        await page.locator('select[name="active"]').selectOption('false');
        await page.getByRole('button', { name: 'Create' }).click();

        await expect(page.getByText('Client created successfully!')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Create Client' })).toBeHidden();
    });

    test('editing a client should display correct information', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.locator('div').filter({ hasText: /^Anna de Boer\+316100000157 Pine PlaceActiveEdit$/ }).getByRole('button').click();
        await expect(page.getByRole('heading', { name: 'Edit Client' })).toBeVisible();
        await expect(page.getByLabel('First Name')).toHaveValue('Anna');
        await expect(page.getByLabel('Last Name')).toHaveValue('de Boer');
        await expect(page.getByLabel('Device code')).toHaveValue('15151515-1515-1515-1515-151515151515');
        await expect(page.getByLabel('Phone Number')).toHaveValue('+31610000015');
        await expect(page.getByLabel('Address')).toHaveValue('7 Pine Place');
        await expect(page.locator('div').filter({ hasText: /^user14@example\.com$/ }).nth(1)).toBeVisible();
    });

    test('editing a client should work correctly', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.locator('div').filter({ hasText: /^Daan Meijer\+3161000000876 Willow WayActiveEdit$/ }).getByRole('button').click();
        await page.locator('form svg').click();
        await page.getByRole('option', { name: 'user2@example.com' }).click();
        await page.locator('form').getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByText('Client data edited')).toBeVisible();
    });

    test('should delete a client when action is confirmed', async ({ page }) => {
        await page.goto('/ClientOverview');
        await page.locator('div').filter({ hasText: /^Eva Dekker\+3161000001161 Ivy DriveInactiveEdit$/ }).getByRole('button').click();
        await page.getByRole('button', { name: 'Delete Client' }).click();
        await page.getByRole('button', { name: 'Yes, delete' }).click();
        await expect(page.getByText('Client deleted successfully!')).toBeVisible();
    });
});

