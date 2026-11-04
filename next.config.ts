import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import legacyRedirects from "./data/catalog/legacy-redirects.json";

/** next-intl istek yapılandırmını bağlar (mesaj dosyaları + locale çözümü) */
const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  outputFileTracingIncludes: {
    "/[locale]/blog/[slug]": ["./content/**/*"],
    "/[locale]/blog": ["./content/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/apple-touch-icon.png",
        statusCode: 302,
      },
      ...legacyRedirects.map((redirect) => ({
        source: redirect.source,
        destination: redirect.destination,
        statusCode: redirect.permanent ? 301 : 302,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      const minimizer = config.optimization?.minimizer;
      if (Array.isArray(minimizer)) {
        config.optimization.minimizer = minimizer.filter(
          (plugin) =>
            plugin &&
            plugin.constructor &&
            plugin.constructor.name !== "CssMinimizerPlugin",
        );
      }
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
