import { expect, test } from '@playwright/test';
import { configuredBasePath } from '../scripts/config.mjs';

const prefix = configuredBasePath();
const url = (path: string) => `${prefix}${path}`;

test('primary navigation is available on every application section', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile';
  const routes = ['/', '/explore/', '/docs/', '/packs/', '/ui/'];
  for (const route of routes) {
    await page.goto(url(route));
    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();
    await expect(header.getByRole('link', { name: 'BAG home' })).toHaveAttribute('href', url('/'));
    if (mobile) {
      await header.getByRole('button', { name: 'Open main menu' }).click();
      const nav = header.getByRole('navigation', { name: 'Mobile main navigation' });
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Explorer' })).toHaveAttribute('href', url('/explore/'));
    } else {
      const nav = header.getByRole('navigation', { name: 'Main navigation' });
      await expect(nav.getByRole('link', { name: 'Explorer' })).toHaveAttribute('href', url('/explore/'));
      await expect(nav.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', url('/docs/'));
    }
  }
});

test('Explorer can navigate to documentation and back without losing the Drop Bag', async ({ page }, testInfo) => {
  await page.goto(url('/explore/'));
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: '+ Add loadout' }).first().click();
  const header = page.getByTestId('site-header');
  await expect(header.getByRole('link', { name: /Drop Bag \([1-9]\d* selected\)/ })).toBeVisible();
  if (testInfo.project.name === 'mobile') {
    await header.getByRole('button', { name: 'Open main menu' }).click();
    await header.getByRole('navigation', { name: 'Mobile main navigation' }).getByRole('link', { name: 'Documentation' }).click();
  } else {
    await header.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Documentation' }).click();
  }
  await expect(page).toHaveURL(new RegExp(`${prefix}/docs/$`));
  await expect(page.getByTestId('site-header').getByRole('link', { name: /Drop Bag \([1-9]\d* selected\)/ })).toBeVisible();
  await page.getByTestId('site-header').getByRole('link', { name: /Drop Bag \([1-9]\d* selected\)/ }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/explore/$`));
  await expect(page.getByLabel('Generated agent prompt')).toHaveValue(/Selected resources and scope:/);
});

test('global search opens from the standalone Explorer', async ({ page }) => {
  await page.goto(url('/explore/'));
  await page.getByTestId('site-header').getByRole('button', { name: 'Open Search' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
