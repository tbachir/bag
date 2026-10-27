import { configuredBasePath } from '../scripts/config.mjs';
import { expect, test } from '@playwright/test';

const prefix = configuredBasePath();
const url = (value: string) => `${prefix}${value}`;

test('read the complete inventory and navigate between zones', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url('/'));
  await page.getByRole('link', { name: 'Explore the documentation' }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/docs/$`));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BAG');
  await expect(page.getByRole('link', { name: 'Explore inventory', exact: true })).toHaveAttribute('href', url('/docs/inventory/'));
  await page.getByRole('link', { name: 'Explore inventory', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/docs/inventory/$`));
  await page.goto(url('/docs/zones/'));
  await expect(page.getByRole('table').getByRole('link')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'Open Inventory', exact: true })).toHaveAttribute('href', url('/docs/inventory/'));
  expect(errors).toEqual([]);
});

test('search finds a deep generated document', async ({ page }) => {
  await page.goto(url('/docs/'));
  await page.getByRole('button', { name: /^(Open Search|Search)/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox').fill('account-isolation');
  await dialog.getByRole('option', { name: /Task: account-isolation/i }).first().click();
  await expect(page).toHaveURL(/\/docs\/inventory\/supabase\/auth\/tasks\/security\/account-isolation\/?(?:#.*)?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/isolation/i);
});

test('read agent references and open the original GitHub source', async ({ page }) => {
  await page.goto(url('/docs/skill-tree/skills/bag-inventory/skill/'));
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('main').getByText('equip a project with a BAG loadout', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  await expect(page.getByRole('link', { name: /github/i }).last()).toHaveAttribute('href', 'https://github.com/tbachir/bag/blob/main/skill-tree/skills/bag-inventory/SKILL.md');
  await page.goto(url('/docs/inventory/supabase/auth/agents/'));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Auth delegation');
});

test('serve generated Markdown, downloads, LLM text, images, and real 404s', async ({ request }) => {
  for (const resource of ['/llms.txt', '/llms-full.txt', '/llms.mdx/docs/content.md', '/docs.md']) {
    const response = await request.get(url(resource));
    expect(response.ok(), resource).toBeTruthy();
    expect(await response.text()).toContain('BAG');
  }
  const index = await request.get(url('/llms.txt'));
  expect(await index.text()).toContain(`](${prefix}/docs/inventory)`);
  const shortcut = await request.get(url('/docs.md'));
  expect(await shortcut.text()).toContain(`](${prefix}/docs/inventory/)`);
  const deep = await request.get(url('/docs/inventory/supabase/auth/tasks/security/account-isolation.md'));
  expect(deep.ok()).toBeTruthy();
  expect(await deep.text()).toContain('isolation');
  const download = await request.get(url('/files/equipment/configs/.editorconfig.template'));
  expect(download.ok()).toBeTruthy();
  expect(await download.text()).toContain('root = true');
  const image = await request.get(url('/og/docs/image.png'));
  expect(image.ok()).toBeTruthy();
  expect(image.headers()['content-type']).toContain('image/png');
  const missing = await request.get(url('/docs/does-not-exist/'));
  expect(missing.status()).toBe(404);
  const html = await request.get(url('/docs/inventory/'));
  expect(await html.text()).toContain(`${prefix}/_next/`);
});
