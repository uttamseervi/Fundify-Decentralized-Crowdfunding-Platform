/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fixes wallet connect dependency issue
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: ["imgs.search.brave.com", "ipfs.io","via.placeholder.com"], // include all valid domains
  },
};

export default nextConfig;
