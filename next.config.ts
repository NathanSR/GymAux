import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    disableDevLogs: true,
  },
  cacheOnFrontEndNav: true, // Crucial para sensação de app
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
});

const nextConfig = {
  // Melhora a performance de carregamento de pacotes pesados (como Lucide ou Lodash)
  optimizePackageImports: ['lucide-react', 'framer-motion'],
  // Ajuda na velocidade de navegação reduzindo o payload de dados entre páginas
  experimental: {
    scrollRestoration: true,
  },
};

// Combine os plugins
export default withPWA(withNextIntl(nextConfig));