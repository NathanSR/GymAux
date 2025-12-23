import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Corresponde a todas as rotas, exceto arquivos estáticos e pastas internas
    matcher: ['/', '/(pt|en|es)/:path*']
};