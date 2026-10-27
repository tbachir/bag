import nextEnv from '@next/env';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function normalizeBasePath(value = '') {
  const result = value.replace(/\/$/, '');
  if (result && !/^\/(?:[a-zA-Z0-9_-]+)(?:\/[a-zA-Z0-9_-]+)*$/.test(result)) {
    throw new Error('DOCS_BASE_PATH must be empty or a path such as /bag');
  }
  return result;
}
export function configuredBasePath() {
  // Export tools and the test server must load the same production env files as next build.
  nextEnv.loadEnvConfig(app, false, { info() {}, error() {} });
  return normalizeBasePath(process.env.DOCS_BASE_PATH ?? '');
}
