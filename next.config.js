const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || 'dev',
  },
  // Transpile the shared package so it works in the Next.js build pipeline
  transpilePackages: ['shared'],
  experimental: {
    // Required for monorepo: tells Next.js to trace files from the repo root
    // so the shared/ folder is included in the Vercel deployment
    outputFileTracingRoot: path.join(__dirname, '..'),
  },
};

module.exports = nextConfig;
