import type { NextConfig } from 'next';

// The Vercel deployment serves this fully static marketing site with no
// server-side rendering, so it builds as a static export there. The
// Cloudflare Workers deployment (the primary target) keeps SSR.
const nextConfig: NextConfig =
  process.env.VERCEL === '1'
    ? { output: 'export', images: { unoptimized: true } }
    : {};

export default nextConfig;
