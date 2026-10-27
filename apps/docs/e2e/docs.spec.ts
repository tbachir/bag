import { expect, test } from '@playwright/test';

test('read docs and navigate to all seven zones', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the documentation' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Your Developer's Inventory");
  await page.getByRole('link', { name: 'Choose a zone' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Explore the seven zones');
  await expect(page.getByRole('table').getByRole('link')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'Open Inventory', exact: true })).toHaveAttribute(
    'href', 'https://github.com/tbachir/bag/blob/main/inventory/README.md',
  );
  expect(errors).toEqual([]);
});

test('search the exported index in the browser', async ({ page }) => {
  await page.goto('/docs/');
  await page.getByRole('button', { name: /^(Open Search|Search)/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox').fill('seven zones');
  await dialog.getByRole('option', { name: /Explore the seven zones/ }).first().click();
  await expect(page).toHaveURL(/\/docs\/zones\/?(?:#.*)?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Explore the seven zones');
});

test('serve static LLM content and Open Graph images', async ({ request }) => {
  for (const path of ['/llms.txt', '/llms-full.txt', '/llms.mdx/docs/content.md']) {
    const response = await request.get(path);
    expect(response.ok(), path).toBeTruthy();
    expect(await response.text()).toContain("Your Developer's Inventory");
  }
  const image = await request.get('/og/docs/image.png');
  expect(image.ok()).toBeTruthy();
  expect(image.headers()['content-type']).toContain('image/png');
  const missing = await request.get('/docs/does-not-exist/');
  expect(missing.status()).toBe(404);
});
