/**
 * GymAux - Service Worker Nativo Ultra-Resiliente (Web Standards)
 * Separação estrita entre HTML_CACHE, RSC_CACHE e STATIC_CACHE.
 * Suporte completo a rotas estáticas e dinâmicas ([id], /session, /edit).
 * 100% Offline-First.
 */

const CACHE_VERSION = 'gymaux-v5.2.0';
const CORE_CACHE = `gymaux-core-${CACHE_VERSION}`;
const HTML_CACHE = `gymaux-html-${CACHE_VERSION}`;
const RSC_CACHE = `gymaux-rsc-${CACHE_VERSION}`;
const STATIC_CACHE = `gymaux-static-${CACHE_VERSION}`;

const APP_SHELL_PATH = '/pt/home';

// Arquivos vitais pré-carregados na instalação
const PRECACHE_ASSETS = [
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/logo.png',
    '/sounds/3-2-1-ja.mp3',
    '/ios/16.png',
    '/ios/32.png',
    '/ios/64.png',
    '/ios/128.png',
    '/ios/180.png',
    '/ios/192.png',
    '/ios/512.png',
];

/**
 * Localiza no cache qualquer entrada cujo pathname case com a regex informada.
 * Permite servir o shell correto para rotas dinâmicas com IDs desconhecidos no offline.
 */
async function findCachedByPattern(cache, pattern) {
    try {
        const keys = await cache.keys();
        for (const req of keys) {
            const reqUrl = new URL(req.url);
            if (pattern.test(reqUrl.pathname)) {
                return await cache.match(req);
            }
        }
    } catch {
        // Ignora erros de leitura de cache
    }
    return null;
}

// 1. Instalação: Pré-cache individual e seguro
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CORE_CACHE).then(async (cache) => {
            for (const asset of PRECACHE_ASSETS) {
                try {
                    await cache.add(new Request(asset, { cache: 'reload' }));
                } catch (err) {
                    console.warn(`[SW] Precache individual ignorado para ${asset}:`, err);
                }
            }
        }).then(() => self.skipWaiting())
    );
});

// 2. Ativação: Limpeza de caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (
                        key.startsWith('gymaux-') &&
                        key !== CORE_CACHE &&
                        key !== HTML_CACHE &&
                        key !== RSC_CACHE &&
                        key !== STATIC_CACHE
                    ) {
                        console.log('[SW] Purgando cache antigo:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Comunicação
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 4. Interceptação de Requisições
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // SEGURANÇA 1: Ignora requisições não-GET
    if (request.method !== 'GET') {
        return;
    }

    // SEGURANÇA 2: Bypass TOTAL para APIs do Supabase e Auth
    const isSupabase = url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in');
    const isAuthOrApi = url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/');
    if (isSupabase || isAuthOrApi) {
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 1: Next.js App Router RSC (React Server Components)
    // =========================================================================
    const isRsc = request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');
    if (isRsc) {
        event.respondWith(
            fetch(request)
                .then(async (networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        const rscCache = await caches.open(RSC_CACHE);
                        await rscCache.put(url.pathname, clone.clone());
                        await rscCache.put(url.pathname + url.search, clone);
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const rscCache = await caches.open(RSC_CACHE);
                    const cachedRsc =
                        (await rscCache.match(url.pathname + url.search)) ||
                        (await rscCache.match(url.pathname)) ||
                        (await rscCache.match(url.pathname, { ignoreSearch: true }));

                    if (cachedRsc) return cachedRsc;

                    // Fallbacks inteligentes por padrão para rotas dinâmicas RSC
                    // 1. Sessão de treino: busca qualquer shell de sessão em cache
                    if (url.pathname.includes('/session/')) {
                        const sessionRsc = await findCachedByPattern(rscCache, /\/session\/[^/]+$/);
                        if (sessionRsc) return sessionRsc;
                    }

                    // 2. Edição de treino: busca qualquer shell de edição de treino em cache
                    if (url.pathname.includes('/workouts/') && url.pathname.endsWith('/edit')) {
                        const editWorkoutRsc = await findCachedByPattern(rscCache, /\/workouts\/[^/]+\/edit$/);
                        if (editWorkoutRsc) return editWorkoutRsc;
                    }

                    // 3. Edição de agenda: busca qualquer shell de edição de agenda em cache
                    if (url.pathname.includes('/schedules/') && url.pathname.endsWith('/edit')) {
                        const editScheduleRsc = await findCachedByPattern(rscCache, /\/schedules\/[^/]+\/edit$/);
                        if (editScheduleRsc) return editScheduleRsc;
                    }

                    // 4. Edição de exercício: busca qualquer shell de edição de exercício em cache
                    if (url.pathname.includes('/exercises/') && url.pathname.endsWith('/edit')) {
                        const editExerciseRsc = await findCachedByPattern(rscCache, /\/exercises\/[^/]+\/edit$/);
                        if (editExerciseRsc) return editExerciseRsc;
                    }

                    // 5. Detalhes de exercício: busca qualquer shell de detalhe em cache
                    if (url.pathname.includes('/exercises/') && !url.pathname.endsWith('/new')) {
                        const viewExerciseRsc = await findCachedByPattern(rscCache, /\/exercises\/[^/]+$/);
                        if (viewExerciseRsc) return viewExerciseRsc;
                    }

                    // Resposta RSC vazia válida para o Next.js cliente assumir sem crash
                    return new Response('', {
                        status: 200,
                        headers: { 'Content-Type': 'text/x-component' }
                    });
                })
        );
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 2: Navegações de Página HTML (Documentos e F5)
    // =========================================================================
    const isHtmlNav =
        request.mode === 'navigate' ||
        request.destination === 'document' ||
        request.headers.get('accept')?.includes('text/html');

    if (isHtmlNav) {
        event.respondWith(
            fetch(request)
                .then(async (networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const contentType = networkResponse.headers.get('content-type') || '';
                        // Salva APENAS documentos HTML válidos no HTML_CACHE
                        if (contentType.includes('text/html')) {
                            const clone = networkResponse.clone();
                            const htmlCache = await caches.open(HTML_CACHE);
                            await htmlCache.put(url.pathname, clone.clone());
                            await htmlCache.put(request, clone.clone());

                            if (url.pathname.endsWith('/home')) {
                                await htmlCache.put(APP_SHELL_PATH, clone);
                            }
                        }
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const htmlCache = await caches.open(HTML_CACHE);

                    // Redirecionamento amigável offline da raiz '/' para o App
                    if (url.pathname === '/' || url.pathname === '') {
                        const homeHtml = await htmlCache.match(APP_SHELL_PATH);
                        if (homeHtml) return homeHtml;
                    }

                    // 1. Tenta a página exata da URL
                    const cachedPage = (await htmlCache.match(url.pathname)) || (await htmlCache.match(request));
                    if (cachedPage) return cachedPage;

                    // 2. Tenta ignorando parâmetros de busca
                    const cachedNoQuery = await htmlCache.match(url.pathname, { ignoreSearch: true });
                    if (cachedNoQuery) return cachedNoQuery;

                    // 3. Fallbacks inteligentes por padrão para rotas dinâmicas
                    // Sessão de treino: /session/[id] -> shell de sessão
                    if (url.pathname.includes('/session/')) {
                        const sessionHtml = await findCachedByPattern(htmlCache, /\/session\/[^/]+$/);
                        if (sessionHtml) return sessionHtml;
                    }

                    // Edição de treino: /workouts/[id]/edit -> shell de edição de treino
                    if (url.pathname.includes('/workouts/') && url.pathname.endsWith('/edit')) {
                        const editHtml = await findCachedByPattern(htmlCache, /\/workouts\/[^/]+\/edit$/);
                        if (editHtml) return editHtml;
                    }

                    // Edição de agenda: /schedules/[id]/edit -> shell de edição de agenda
                    if (url.pathname.includes('/schedules/') && url.pathname.endsWith('/edit')) {
                        const editHtml = await findCachedByPattern(htmlCache, /\/schedules\/[^/]+\/edit$/);
                        if (editHtml) return editHtml;
                    }

                    // Edição de exercício: /exercises/[id]/edit -> shell de edição de exercício
                    if (url.pathname.includes('/exercises/') && url.pathname.endsWith('/edit')) {
                        const editHtml = await findCachedByPattern(htmlCache, /\/exercises\/[^/]+\/edit$/);
                        if (editHtml) return editHtml;
                    }

                    // Detalhe de exercício: /exercises/[id] -> shell de detalhes
                    if (url.pathname.includes('/exercises/') && !url.pathname.endsWith('/new')) {
                        const exHtml = (await findCachedByPattern(htmlCache, /\/exercises\/[^/]+$/)) || (await htmlCache.match('/pt/exercises'));
                        if (exHtml) return exHtml;
                    }

                    // 4. Fallback final para tela offline
                    const coreCache = await caches.open(CORE_CACHE);
                    const offlinePage = await coreCache.match('/offline.html');
                    return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
                })
        );
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 3: Arquivos Estáticos (JS Chunks, CSS Tailwind, Fontes, Imagens, Áudios)
    // =========================================================================
    const isStaticAsset =
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/sounds/') ||
        url.pathname.startsWith('/ios/') ||
        url.pathname.startsWith('/windows11/') ||
        url.pathname.startsWith('/android/') ||
        /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ico|mp3|wav|ogg)$/i.test(url.pathname);

    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Revalida em segundo plano
                    fetch(request).then(async (networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const cache = await caches.open(STATIC_CACHE);
                            cache.put(request, networkResponse);
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }

                // Se não estiver em cache, busca na rede e armazena
                return fetch(request).then(async (networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        const cache = await caches.open(STATIC_CACHE);
                        cache.put(request, clone);
                    }
                    return networkResponse;
                }).catch(() => cachedResponse);
            })
        );
        return;
    }

    // Padrão: Tenta rede, fallback para cache
    event.respondWith(
        fetch(request).catch(async () => {
            return (await caches.match(request)) || (await caches.match(url.pathname));
        })
    );
});
