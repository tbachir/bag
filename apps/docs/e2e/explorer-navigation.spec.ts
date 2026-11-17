import { expect, test } from '@playwright/test';
import { configuredBasePath } from '../scripts/config.mjs';

const prefix = configuredBasePath();
const url = (path: string) => `${prefix}${path}`;

test('Explorer filters are shareable and survive reload', async ({ page }) => {
  await page.goto(url('/explore/?q=supabase&view=paths'));
  await expect(page.getByRole('textbox', { name: 'Search BAG items' })).toHaveValue('supabase');
  await expect(page.getByRole('button', { name: 'Folder view' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('textbox', { name: 'Search BAG items' }).fill('expo');
  await expect(page).toHaveURL(/q=expo/);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Search BAG items' })).toHaveValue('expo');
});

test('Explorer paginates inventory rather than hiding matches past a fixed cap', async ({ page }) => {
  await page.goto(url('/explore/'));
  const status = page.getByRole('status');
  await expect(status).toContainText(/results/);
  const next = page.getByRole('button', { name: 'Next', exact: true });
  if (await next.count()) {
    await next.click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByRole('navigation', { name: 'Inventory pages' })).toContainText('2 /');
    await page.reload();
    await expect(page.getByRole('navigation', { name: 'Inventory pages' })).toContainText('2 /');
  }
});

test('Drop Bag stays reachable on mobile while browsing inventory', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Dedicated mobile shortcut');
  await page.goto(url('/explore/'));
  await expect(page.getByRole('link', { name: /Open your Drop Bag/ })).toHaveAttribute('href', '#drop-bag');
  await page.getByRole('link', { name: /Open your Drop Bag/ }).click();
  await expect(page).toHaveURL(/#drop-bag$/);
  await expect(page.getByRole('heading', { name: 'Your Drop Bag' })).toBeVisible();
});
