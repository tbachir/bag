import { normalizeBasePath } from './scripts/config.mjs';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();
const basePath = normalizeBasePath(process.env.DOCS_BASE_PATH ?? '');

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  images: { unoptimized: true },
  basePath,
  env: { NEXT_PUBLIC_DOCS_BASE_PATH: basePath },
  trailingSlash: true,
  reactStrictMode: true,
  webpack(config, { dev }) {
    // Fumadocs uses dynamic imports whose dependencies cannot be serialized safely.
    if (!dev) config.cache = false;
    return config;
  },
  // Keep static generation within the shared WSL host's memory budget.
  experimental: { cpus: 1 },
};

export default withMDX(config);
