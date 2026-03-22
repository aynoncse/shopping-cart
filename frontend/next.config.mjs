/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const storagePath = '/storage/:path*';
    return [
      {
        source: storagePath,
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${storagePath}`,
      },
    ];
  },
};

export default nextConfig;
