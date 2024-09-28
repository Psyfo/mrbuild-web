/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto', // This ensures .mjs files are properly handled
    });
    return config;
  },
};

export default nextConfig;
