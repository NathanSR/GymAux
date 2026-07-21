import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  extendDefaultRuntimeCaching: true,
  fallbacks: {
    document: "/pt/home",
  },
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        // Sons do timer de treino e mídia local - CacheFirst imediato
        urlPattern: /\.(?:mp3|wav|ogg|m4a|aac)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "sounds-media-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 24 * 60 * 60, // 60 dias
          },
        },
      },
      {
        // Supabase API requests - NetworkFirst com cache fallback para offline
        urlPattern: /^https:\/\/.*\.supabase\.(co|in)\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "supabase-api-cache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
          },
          networkTimeoutSeconds: 2, // Fail-fast para resposta instantânea offline
        },
      },
      {
        // Assets estáticos (imagens, fontes) - CacheFirst
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff2?|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets-cache",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
          },
        },
      },
      {
        // Navegação de páginas HTML (App Shell) - StaleWhileRevalidate para abertura instantânea
        urlPattern: ({ request, url }: { request: any; url: URL }) =>
          request.mode === "navigate" && !url.pathname.includes('/login') && !url.pathname.includes('/register') && !url.pathname.includes('/admin'),
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "pages-html-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias — os dados da UI vêm do Dexie
          },
        },
      },
      {
        // Dados de rotas do Next.js - NetworkFirst
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "next-data-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60,
          },
          networkTimeoutSeconds: 2,
        },
      },
    ],
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
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