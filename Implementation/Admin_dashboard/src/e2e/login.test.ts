import { test, expect } from '@playwright/test';


test('should redirect the user if he logs in', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('r.balint@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('password');
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - heading "Log in" [level=2]
    - textbox "Email": r.balint@gmail.com
    - button
    - textbox "Password": password
    - button "Log In"
    `);
    await page.getByRole('button', { name: 'Log In' }).click();

    const cookies = await page.context().cookies();

    console.log(cookies);
    // const accessToken = cookies.find(c => c.name === 'accessToken');
    // const refreshToken = cookies.find(c => c.name === 'refreshToken');

    // // ✅ Assert cookies exist
    // expect(accessToken).toBeDefined();
    // expect(refreshToken).toBeDefined();

    // // 🧠 (Optional) Check cookie properties
    // expect(accessToken?.httpOnly).toBe(true);
    // expect(accessToken?.secure).toBe(true);

    await expect(page.getByRole('paragraph')).toMatchAriaSnapshot(`- paragraph: Log in redirected`);
    await expect(page).toHaveURL('http://localhost:5173/aaa');
});

test('should see error for invalid email', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Invalid email format')).toBeVisible();
});


test('should see error for missing password', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('r.balint@gmail.com');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Password has to be filled in')).toBeVisible();
});

test('should be informed of login failed due to invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('r.balint@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('passwordwrong');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Login failed')).toBeVisible();
});