import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Supabase API requests - NetworkFirst with cache fallback for offline usage
        urlPattern: /^https:\/\/.*\.supabase\.(co|in)\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "supabase-api-cache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
          networkTimeoutSeconds: 3, // Fast fail for offline mode
        },
      },
      {
        // Static assets (images, fonts) - CacheFirst
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff2?)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets-cache",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        // Next.js page navigation data and internal APIs - NetworkFirst
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "next-data-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 3,
        },
      },
    ],
  },
  cacheOnFrontEndNav: true, // App-like instant navigation feel
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
});

const nextConfig = {
  // Melhora a performance de carregamento de pacotes pesados
  optimizePackageImports: ['lucide-react', 'framer-motion'],
  // Configuracoes experimentais para performance de SPA
  experimental: {
    scrollRestoration: true,
  },
};

export default withPWA(withNextIntl(nextConfig));