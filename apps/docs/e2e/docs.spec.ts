import { configuredBasePath } from '../scripts/config.mjs';
import { expect, test } from '@playwright/test';

const prefix = configuredBasePath();
const url = (value: string) => `${prefix}${value}`;

test('read the complete inventory and navigate between zones', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url('/'));
  await page.getByRole('link', { name: 'Explore the inventory', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/docs/$`));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BAG');
  // Follow the canonical inventory URL rather than a copy-dependent link label.
  const inventoryLink=page.locator('main a[href="'+url('/docs/inventory/')+'"]').first();
  await expect(inventoryLink).toBeVisible();
  await inventoryLink.click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/docs/inventory/$`));
  await page.goto(url('/docs/zones/'));
  // The item-first guide exposes goals instead of the old seven-zone table.
  await expect(page.getByRole('link', { name: 'Explore resources', exact: true })).toHaveAttribute('href', url('/docs/inventory/'));
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

test('Drop Bag composes a persistent prompt without executing installations', async ({ page }) => {
  await page.goto(url('/explore/'));
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: '+ Add loadout' }).first().click();
  await expect(page.getByRole('heading', { name: 'Your Drop Bag' })).toBeVisible();
  await expect(page.getByLabel('Generated agent prompt')).toHaveValue(/Selected resources:/);
  const before = await page.getByLabel('Generated agent prompt').inputValue();
  expect(before).toContain('AGENTS.md');
  await page.reload();
  await expect(page.getByLabel('Generated agent prompt')).toHaveValue(before);
  await page.getByRole('button', { name: 'Clear Drop Bag' }).click();
  await expect(page.getByLabel('Generated agent prompt')).toHaveValue('Select resources to generate your prompt.');
});

test('resource template links to built skill ZIP and library source', async ({ page,request }) => {
  await page.goto(url('/docs/skill-tree/skills/repository-auditor/'));
  await expect(page.getByRole('button', {name:'Add to Drop Bag'})).toBeVisible();
  await expect(page.getByText('Ready-to-run prompts')).toBeVisible();
  const archive=await request.get(url('/files/skills/repository-auditor.zip'));
  expect(archive.ok()).toBeTruthy();
  expect((await archive.body()).subarray(0,4).toString('hex')).toBe('504b0304');
});

test('packs directory exposes packaged boilerplate and curated loadouts', async ({page}) => {
  await page.goto(url('/packs/'));
  await expect(page.getByRole('heading', { name: 'Packs & Templates' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Packaged starters' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Expo · Production Foundations/ })).toBeVisible();
});

test('task-aware Drop Bag includes transitive prerequisites and keeps selection after navigation',async ({page})=>{
  await page.goto(url('/docs/inventory/supabase/auth/'));
  await page.evaluate(()=>{localStorage.clear();});
  await page.reload();
  const oauth=page.getByRole('checkbox',{name:'Task: Connexion OAuth'});
  await oauth.check();
  await expect(page.getByRole('checkbox',{name:'Task: Sessions sécurisées'})).toBeChecked();
  await expect(page.getByRole('checkbox',{name:'Task: Initialiser la configuration'})).toBeChecked();
  await page.goto(url('/explore/'));
  await expect(page.getByLabel('Generated agent prompt')).toHaveValue(/\[oauth\] Connexion OAuth/);
  await expect(page.getByLabel('Generated agent prompt')).toHaveValue(/\[sessions\] Sessions sécurisées/);
  await page.reload();
  await expect(page.getByLabel('Generated agent prompt')).toHaveValue(/\[oauth\] Connexion OAuth/);
});

test('Drop Bag detects a declared resource dependency without installing it',async ({page})=>{
  await page.goto(url('/docs/inventory/libraries/reui/'));
  await page.evaluate(()=>{localStorage.clear();});
  await page.reload();
  await page.getByRole('button',{name:'Add to Drop Bag'}).click();
  await page.goto(url('/explore/'));
  await expect(page.getByRole('region',{name:'Drop Bag compatibility analysis'})).toContainText('required resource');
  await page.getByRole('button',{name:'Add required reference'}).first().click();
  await expect(page.getByRole('region',{name:'Drop Bag compatibility analysis'})).not.toContainText('required resource');
});
