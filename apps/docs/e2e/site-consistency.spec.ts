import { expect, test } from '@playwright/test';
import { configuredBasePath } from '../scripts/config.mjs';

const prefix = configuredBasePath();
const url = (path: string) => `${prefix}${path}`;

test('Packs and Workbench expose accessible intra-page navigation', async ({ page }) => {
  await page.goto(url('/packs/'));
  const packs = page.getByRole('navigation', { name: 'On this page' });
  await expect(packs.getByRole('link', { name: 'Curated loadouts' })).toHaveAttribute('href', '#loadouts-heading');
  await packs.getByRole('link', { name: 'Curated loadouts' }).click();
  await expect(page).toHaveURL(/#loadouts-heading$/);
  await expect(page.getByRole('heading', { name: 'Curated loadouts' })).toBeVisible();

  await page.goto(url('/ui/'));
  const workbench = page.getByRole('navigation', { name: 'On this page' });
  await expect(workbench.getByRole('link', { name: 'Live stories' })).toHaveAttribute('href', '#stories');
  await workbench.getByRole('link', { name: 'Live stories' }).click();
  await expect(page).toHaveURL(/#stories$/);
  await expect(page.getByRole('heading', { name: 'Live stories' })).toBeVisible();
});

test('Packs and Workbench retain shared header and avoid horizontal document overflow', async ({ page }) => {
  for (const path of ['/packs/', '/ui/']) {
    await page.goto(url(path));
    await expect(page.getByTestId('site-header')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow, `Document must not overflow horizontally on ${path}`).toBe(false);
  }
});

test('Documentation language switch points to localized routes', async ({ page }) => {
  await page.goto(url('/docs/'));
  const lang = page.getByRole('navigation', { name: 'Documentation language' });
  await expect(lang.getByRole('link', { name: 'FR' })).toHaveAttribute('href', url('/fr/docs/'));
  await lang.getByRole('link', { name: 'FR' }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/fr/docs/$`));
  await expect(page.getByTestId('site-header')).toBeVisible();
});
