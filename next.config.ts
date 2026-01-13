import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001'
  }
};

export default nextConfig;
