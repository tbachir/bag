import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  // Keep static generation within the shared WSL host's memory budget.
  experimental: { cpus: 1 },
};

export default withMDX(config);
