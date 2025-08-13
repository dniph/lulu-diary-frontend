/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stardewvalleywiki.com',
        pathname: '/mediawiki/images/**',
      },
    ],
  },
};

export default nextConfig;
