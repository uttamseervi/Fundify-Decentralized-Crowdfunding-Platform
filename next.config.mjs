/** @type {import('next').NextConfig} */
const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
  images: {
    domains: ["imgs.search.brave.com"]
  },
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'via.placeholder.com', // or wherever your image is from
      pathname: '/**',
    },
  ],
};

export default nextConfig;
