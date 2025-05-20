// tests/userOverview.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
test.use({ storageState: 'tests/.auth/user.json' }); // 👈 Logged-in

test.describe("User Page tests", () => {


    test('should show user overview', async ({ page }) => {
        await page.goto('/UserOverview');
        await expect(page.locator('h1')).toContainText('User Overview');
    });

    test('should load list of all 15 users in the db', async ({ page }) => {
        await page.goto('/UserOverview');

        await page.waitForSelector('button:has-text("Edit")', { timeout: 10000 });
        const editButtons = page.locator('button:has-text("Edit")');
        const count = await editButtons.count();

        expect(count).toBeGreaterThan(10);
        expect(count).toBeLessThanOrEqual(20);
    });

    test('should display a user when searching for his name', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.getByRole('textbox', { name: 'Search user name, role' }).click();
        await page.getByRole('textbox', { name: 'Search user name, role' }).fill('Emma');
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.getByText('Emma Anderson+3161000000342')).toBeVisible();
    });

    test('should display a message when no matching users are found', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.getByRole('textbox', { name: 'Search user name, role' }).click();
        await page.getByRole('textbox', { name: 'Search user name, role' }).fill('non-existent');
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.getByText('No users matching the search')).toBeVisible();
    });

    test('should display the full user list after clearing the search', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.getByRole('textbox', { name: 'Search user name, role' }).click();
        await page.getByRole('textbox', { name: 'Search user name, role' }).fill('non-existent');
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByRole('button', { name: 'Clear' }).click();

        await page.waitForSelector('button:has-text("Edit")', { timeout: 10000 });
        const editButtons = page.locator('button:has-text("Edit")');
        const count = await editButtons.count();

        expect(count).toBeGreaterThan(10);
        expect(count).toBeLessThanOrEqual(20);
    });

    test('should display a form for new user creation pressing the new user button', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.getByRole('button', { name: 'New User' }).click();
        await expect(page.getByRole('heading', { name: 'Create New User' })).toBeVisible();
    });

    test('should display a message when some user creation fields are left empty', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.getByRole('button', { name: 'New User' }).click();
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByText('Please fill in all required')).toBeVisible();
    });

    test('should display a message when email is already in use', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.getByRole('button', { name: 'New User' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Robert');
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Balint');
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill('user1@example.com');
        await page.getByRole('textbox', { name: 'Phone Number' }).click();
        await page.getByRole('textbox', { name: 'Phone Number' }).fill('+40 7222 3333 33');
        await page.getByRole('textbox', { name: 'Address' }).click();
        await page.getByRole('textbox', { name: 'Address' }).fill('Koni 25');
        await page.getByRole('textbox', { name: 'Password', exact: true }).click();
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Strong123!');
        await page.getByRole('textbox', { name: 'Confirm Password' }).click();
        await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Strong123!');

        const roleSelect = page.locator('select[name="role"]');
        const activeSelect = page.locator('select[name="active"]');
        const createBtn = page.getByRole('button', { name: 'Create' });

        await roleSelect.scrollIntoViewIfNeeded();
        await roleSelect.selectOption('admin');

        await activeSelect.scrollIntoViewIfNeeded();
        await activeSelect.selectOption('false');

        await createBtn.scrollIntoViewIfNeeded();
        await createBtn.click();

        await expect(page.getByText('Email is already in use.')).toBeVisible();
    });

    test('should create a user when all fields are correct', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.getByRole('button', { name: 'New User' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Alex');
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Johnson');
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill('alex.jhonson@gmail.com');
        await page.getByRole('textbox', { name: 'Phone Number' }).click();
        await page.getByRole('textbox', { name: 'Phone Number' }).fill('+31 223 456 789');
        await page.getByRole('textbox', { name: 'Address' }).click();
        await page.getByRole('textbox', { name: 'Address' }).fill('Straat 25');
        await page.getByRole('textbox', { name: 'Password', exact: true }).click();
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Strong123!');
        await page.getByRole('textbox', { name: 'Confirm Password', exact: true }).click();
        await page.getByRole('textbox', { name: 'Confirm Password', exact: true }).fill('Strong123!');

        const roleSelect = page.locator('select[name="role"]');
        const activeSelect = page.locator('select[name="active"]');
        const createBtn = page.getByRole('button', { name: 'Create' });

        await roleSelect.scrollIntoViewIfNeeded();
        await roleSelect.selectOption('admin');

        await activeSelect.scrollIntoViewIfNeeded();
        await activeSelect.selectOption('false');

        await createBtn.scrollIntoViewIfNeeded();
        await createBtn.click();

        await expect(page.getByText('User created successfully!')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Create User' })).toBeHidden();
    });


    test('editing a user should display correct information', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.locator('div').filter({ hasText: /^Anna de Boer\+316100000157 Pine PlaceActiveEdit$/ }).getByRole('button').click();
        await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
        await expect(page.getByLabel('First Name')).toHaveValue('Anna');
        await expect(page.getByLabel('Last Name')).toHaveValue('de Boer');
        await expect(page.getByLabel('Email')).toHaveValue('user14@example.com');
        await expect(page.getByLabel('Phone Number')).toHaveValue('+31610000015');
        await expect(page.getByLabel('Address')).toHaveValue('7 Pine Place');
    });

    test('editing a user should work correctly', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.locator('div').filter({ hasText: /^Daan Meijer\+3161000000876 Willow WayActiveEdit$/ }).getByRole('button').click();
        await page.getByRole('textbox', { name: 'Address' }).press('ArrowLeft');
        await page.getByRole('textbox', { name: 'Address' }).fill('8 Pine Place');
        await page.locator('form').getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByText('User data edited')).toBeVisible();
    });

    test('should delete a user when action is confirmed', async ({ page }) => {
        await page.goto('/UserOverview');
        await page.locator('div').filter({ hasText: /^Alex Johnson\+31 223 456 789Straat 25InactiveEdit$/ }).getByRole('button').click();
        await page.getByRole('button', { name: 'Delete User' }).click();
        await page.getByRole('button', { name: 'Yes, delete' }).click();
        await expect(page.getByText('User deletedsuccessfully!')).toBeVisible();
    });
});

