import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default withNextIntl(nextConfig);
