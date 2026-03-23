import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';

export default async function middleware(request: NextRequest) {
  // Primeiro, processamos o i18n
  const handleI18nRouting = createMiddleware(routing);
  let response = handleI18nRouting(request);

  // Criamos o client do Supabase para manter a sessão ativa (refresh de tokens)
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
          cookies: {
              getAll() {
                  return request.cookies.getAll();
              },
              setAll(cookiesToSet) {
                  cookiesToSet.forEach(({ name, value }) =>
                      request.cookies.set(name, value)
                  );
                  // Atualizamos a resposta do i18n para incluir os cookies do Supabase
                  response = handleI18nRouting(request);
                  cookiesToSet.forEach(({ name, value, options }) =>
                      response.cookies.set(name, value, options)
                  );
              },
          },
      }
  );

  // Refresh da sessão se necessário
  await supabase.auth.getUser();

  return response;
}

export const config = {
    // Corresponde a todas as rotas, exceto arquivos estáticos e pastas internas (_next, etc)
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};