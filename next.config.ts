import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Ekspor 100% HTML statis murni (Zero Serverless Functions)
  output: 'export',

  // 2. Matikan Vercel Image Optimization (Mencegah hangusnya kuota 1,000 images)
  images: {
    unoptimized: true,
  },

  // 3. Kompresi output aset
  compress: true,

  // 4. Generate ETag untuk validasi cache Cloudflare dan Browser
  generateEtags: true,

  // 5. Normalisasi trailing slash agar konsisten dengan caching Cloudflare
  trailingSlash: false,

  // 6. Matikan header generator 'X-Powered-By' untuk keamanan & efisiensi byte
  poweredByHeader: false,

  // 7. Optimasi output bundle React production
  reactStrictMode: true,
};

export default nextConfig;
