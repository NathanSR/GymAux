/**
 * GymAux - Service Worker Nativo Ultra-Resiliente (Web Standards)
 * Separação estrita entre HTML_CACHE, RSC_CACHE e STATIC_CACHE.
 * Suporte completo a rotas estáticas e dinâmicas ([id], /session, /edit).
 * 100% Offline-First.
 */

const CACHE_VERSION = 'gymaux-v5.4.1';
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

    // SEGURANÇA 2: Bypass para APIs do Supabase e Auth
    // Imagens públicas estáticas do Storage (/storage/v1/object/public/) são permitidas para cache offline
    const isSupabaseStorage = (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) && url.pathname.includes('/storage/v1/object/public/');
    const isSupabaseApi = (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) && !isSupabaseStorage;
    const isAuthOrApi = url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/');
    if (isSupabaseApi || isAuthOrApi) {
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 1: Next.js App Router RSC (Stale-While-Revalidate em 0ms)
    // =========================================================================
    const isRsc = request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');
    if (isRsc) {
        event.respondWith(
            (async () => {
                const rscCache = await caches.open(RSC_CACHE);

                // 1. Tenta recuperar do cache imediatamente (0ms)
                let cachedRsc =
                    (await rscCache.match(url.pathname + url.search)) ||
                    (await rscCache.match(url.pathname)) ||
                    (await rscCache.match(url.pathname, { ignoreSearch: true }));

                // 2. Fallbacks dinâmicos por padrão se não houver exato
                if (!cachedRsc) {
                    if (url.pathname.includes('/session/')) {
                        cachedRsc = await findCachedByPattern(rscCache, /\/session\/[^/]+$/);
                    } else if (url.pathname.includes('/workouts/') && url.pathname.endsWith('/edit')) {
                        cachedRsc = await findCachedByPattern(rscCache, /\/workouts\/[^/]+\/edit$/);
                    } else if (url.pathname.includes('/schedules/') && url.pathname.endsWith('/edit')) {
                        cachedRsc = await findCachedByPattern(rscCache, /\/schedules\/[^/]+\/edit$/);
                    } else if (url.pathname.includes('/exercises/') && url.pathname.endsWith('/edit')) {
                        cachedRsc = await findCachedByPattern(rscCache, /\/exercises\/[^/]+\/edit$/);
                    } else if (url.pathname.includes('/exercises/') && !url.pathname.endsWith('/new')) {
                        cachedRsc = await findCachedByPattern(rscCache, /\/exercises\/[^/]+$/);
                    }
                }

                // Função auxiliar para revalidar na rede em background
                const revalidateRsc = async () => {
                    try {
                        const networkResponse = await fetch(request);
                        if (networkResponse && networkResponse.status === 200) {
                            const clone = networkResponse.clone();
                            await rscCache.put(url.pathname, clone.clone());
                            await rscCache.put(url.pathname + url.search, clone);
                        }
                        return networkResponse;
                    } catch {
                        return null;
                    }
                };

                // Se houver em cache, devolve em 0ms e revalida em segundo plano
                if (cachedRsc) {
                    event.waitUntil(revalidateRsc());
                    return cachedRsc;
                }

                // Se não estiver em cache, aguarda a rede
                const fresh = await revalidateRsc();
                if (fresh) return fresh;

                // Resposta RSC vazia válida para o Next.js cliente assumir sem crash
                return new Response('', {
                    status: 200,
                    headers: { 'Content-Type': 'text/x-component' }
                });
            })()
        );
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 2: Navegações de Página HTML (Stale-While-Revalidate em 0ms)
    // =========================================================================
    const isHtmlNav =
        request.mode === 'navigate' ||
        request.destination === 'document' ||
        request.headers.get('accept')?.includes('text/html');

    if (isHtmlNav) {
        event.respondWith(
            (async () => {
                const htmlCache = await caches.open(HTML_CACHE);

                // Redirecionamento amigável da raiz '/' para o App Shell
                if (url.pathname === '/' || url.pathname === '') {
                    const homeHtml = await htmlCache.match(APP_SHELL_PATH);
                    if (homeHtml) return homeHtml;
                }

                // 1. Tenta recuperar página do cache (0ms)
                let cachedHtml =
                    (await htmlCache.match(url.pathname)) ||
                    (await htmlCache.match(request)) ||
                    (await htmlCache.match(url.pathname, { ignoreSearch: true }));

                // 2. Fallbacks dinâmicos se não houver exato
                if (!cachedHtml) {
                    if (url.pathname.includes('/session/')) {
                        cachedHtml = await findCachedByPattern(htmlCache, /\/session\/[^/]+$/);
                    } else if (url.pathname.includes('/workouts/') && url.pathname.endsWith('/edit')) {
                        cachedHtml = await findCachedByPattern(htmlCache, /\/workouts\/[^/]+\/edit$/);
                    } else if (url.pathname.includes('/schedules/') && url.pathname.endsWith('/edit')) {
                        cachedHtml = await findCachedByPattern(htmlCache, /\/schedules\/[^/]+\/edit$/);
                    } else if (url.pathname.includes('/exercises/') && url.pathname.endsWith('/edit')) {
                        cachedHtml = await findCachedByPattern(htmlCache, /\/exercises\/[^/]+\/edit$/);
                    } else if (url.pathname.includes('/exercises/') && !url.pathname.endsWith('/new')) {
                        cachedHtml = (await findCachedByPattern(htmlCache, /\/exercises\/[^/]+$/)) || (await htmlCache.match('/pt/exercises'));
                    }
                }

                // Função auxiliar para revalidar documento na rede em background
                const revalidateHtml = async () => {
                    try {
                        const networkResponse = await fetch(request);
                        if (networkResponse && networkResponse.status === 200) {
                            const contentType = networkResponse.headers.get('content-type') || '';
                            if (contentType.includes('text/html')) {
                                const clone = networkResponse.clone();
                                await htmlCache.put(url.pathname, clone.clone());
                                await htmlCache.put(request, clone.clone());
                                if (url.pathname.endsWith('/home')) {
                                    await htmlCache.put(APP_SHELL_PATH, clone);
                                }
                            }
                        }
                        return networkResponse;
                    } catch {
                        return null;
                    }
                };

                // Se houver em cache, devolve em 0ms e revalida em segundo plano
                if (cachedHtml) {
                    event.waitUntil(revalidateHtml());
                    return cachedHtml;
                }

                // Se não estiver em cache, aguarda a rede
                const freshHtml = await revalidateHtml();
                if (freshHtml) return freshHtml;

                // Fallback final para tela offline se rede falhar
                const coreCache = await caches.open(CORE_CACHE);
                const offlinePage = await coreCache.match('/offline.html');
                return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
            })()
        );
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 3: Arquivos Estáticos (JS Chunks, CSS Tailwind, Fontes, Imagens, Áudios)
    // =========================================================================
    const isStaticAsset =
        isSupabaseStorage ||
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
                    // Chunks do Next.js e mídias compiladas contêm hash no nome e são 100% imutáveis.
                    // Cache-First puro: retorna imediatamente sem poluir o Network do DevTools.
                    const isImmutable = url.pathname.startsWith('/_next/static/chunks/') || url.pathname.startsWith('/_next/static/media/');
                    if (!isImmutable) {
                        // Revalida em segundo plano apenas ativos estáticos mutáveis (ex: sons, ícones gerais)
                        fetch(request).then(async (networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                const cache = await caches.open(STATIC_CACHE);
                                cache.put(request, networkResponse.clone());
                            }
                        }).catch(() => {});
                    }
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
                }).catch(() => cachedResponse || new Response('', { status: 408, statusText: 'Offline asset not cached' }));
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
