/**
 * GymAux - Service Worker Nativo Local-First (Web Standards)
 * - Separação estrita entre CORE_CACHE, HTML_CACHE, RSC_CACHE e STATIC_CACHE.
 * - Isolamento de payloads RSC de prefetch vs navegação real (Next.js 16 App Router).
 * - Detecção automática de novos deploys via fingerprint de chunks (zero páginas obsoletas).
 * - Nunca armazena respostas redirecionadas (previne cachear /login sobre /home).
 * - Suporte multi-idioma (/pt, /en, /es) e rotas de aluno + treinador.
 */

const CACHE_VERSION = 'gymaux-v6.0.0';
const CORE_CACHE = `gymaux-core-${CACHE_VERSION}`;
const HTML_CACHE = `gymaux-html-${CACHE_VERSION}`;
const RSC_CACHE = `gymaux-rsc-${CACHE_VERSION}`;
const STATIC_CACHE = `gymaux-static-${CACHE_VERSION}`;

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

function extractLocale(pathname) {
    const match = pathname.match(/^\/(pt|en|es)(\/|$)/);
    return match ? match[1] : 'pt';
}

/**
 * Extrai assinatura dos chunks do build Next.js presentes no HTML para detectar novos deploys.
 */
function extractBuildFingerprint(htmlText) {
    if (!htmlText) return null;
    const matches = htmlText.match(/\/_next\/static\/chunks\/[a-zA-Z0-9_\-\.]+\.js/g);
    if (!matches || matches.length === 0) return null;
    return Array.from(new Set(matches)).sort().slice(0, 6).join('|');
}

async function notifyAllClients(message) {
    try {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: false });
        for (const client of clients) {
            client.postMessage(message);
        }
    } catch {
        // Ignore postMessage errors
    }
}

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
        // Ignore cache read errors
    }
    return null;
}

async function getDynamicShellFallback(cache, pathname) {
    const locale = extractLocale(pathname);

    if (pathname === '/' || pathname === '') {
        return (
            (await cache.match(`/${locale}/home`)) ||
            (await cache.match('/pt/home')) ||
            (await cache.match('/en/home')) ||
            (await cache.match('/es/home'))
        );
    }

    // Rotas de Treinador
    if (pathname.includes('/trainer/')) {
        if (/\/trainer\/[^/]+\/workouts\/[^/]+\/edit$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/workouts/[^/]+/edit$`));
        }
        if (/\/trainer\/[^/]+\/workouts\/new$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/workouts/new$`));
        }
        if (/\/trainer\/[^/]+\/workouts$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/workouts$`));
        }
        if (/\/trainer\/[^/]+\/schedule\/[^/]+\/edit$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/schedule/[^/]+/edit$`));
        }
        if (/\/trainer\/[^/]+\/schedule\/new$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/schedule/new$`));
        }
        if (/\/trainer\/[^/]+\/schedule$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/schedule$`));
        }
        if (/\/trainer\/[^/]+\/history$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/history$`));
        }
        if (/\/trainer\/[^/]+\/session$/.test(pathname)) {
            return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+/session$`));
        }
        return await findCachedByPattern(cache, new RegExp(`^/${locale}/trainer/[^/]+$`));
    }

    // Rotas do Usuário
    if (pathname.includes('/session/')) {
        return await findCachedByPattern(cache, new RegExp(`^/${locale}/session/[^/]+$`));
    }
    if (pathname.includes('/workouts/') && pathname.endsWith('/edit')) {
        return await findCachedByPattern(cache, new RegExp(`^/${locale}/workouts/[^/]+/edit$`));
    }
    if (pathname.includes('/schedules/') && pathname.endsWith('/edit')) {
        return await findCachedByPattern(cache, new RegExp(`^/${locale}/schedules/[^/]+/edit$`));
    }
    if (pathname.includes('/exercises/') && pathname.endsWith('/edit')) {
        return await findCachedByPattern(cache, new RegExp(`^/${locale}/exercises/[^/]+/edit$`));
    }
    if (pathname.includes('/exercises/') && !pathname.endsWith('/new')) {
        return (
            (await findCachedByPattern(cache, new RegExp(`^/${locale}/exercises/(?!new($|[?#]))[^/]+$`))) ||
            (await cache.match(`/${locale}/exercises`))
        );
    }

    return null;
}

// 1. Instalação
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CORE_CACHE)
            .then(async (cache) => {
                for (const asset of PRECACHE_ASSETS) {
                    try {
                        await cache.add(new Request(asset, { cache: 'reload' }));
                    } catch (err) {
                        console.warn(`[SW] Precache ignorado para ${asset}:`, err);
                    }
                }
            })
            .then(() => self.skipWaiting())
    );
});

// 2. Ativação: purga caches de versões antigas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((key) => {
                        if (
                            key.startsWith('gymaux-') &&
                            key !== CORE_CACHE &&
                            key !== HTML_CACHE &&
                            key !== RSC_CACHE &&
                            key !== STATIC_CACHE
                        ) {
                            return caches.delete(key);
                        }
                    })
                )
            )
            .then(() => self.clients.claim())
    );
});

// 3. Mensagens da aplicação
self.addEventListener('message', (event) => {
    if (!event.data) return;

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data.type === 'CLEAR_AUTH_CACHES') {
        event.waitUntil(
            Promise.all([caches.delete(HTML_CACHE), caches.delete(RSC_CACHE)])
        );
    }
});

// 4. Interceptação de Requisições
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Apenas GET do mesmo domínio (ou imagens públicas do Supabase Storage)
    if (request.method !== 'GET') return;

    const isSupabaseStorage =
        (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) &&
        url.pathname.includes('/storage/v1/object/public/');
    const isSameOrigin = url.origin === self.location.origin;

    if (!isSameOrigin && !isSupabaseStorage) return;

    // Nunca interceptar APIs ou Auth callbacks
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

    // Raiz '/' -> bypass online para middleware i18n; offline entrega /home cacheada
    if (url.pathname === '/' || url.pathname === '') {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            event.respondWith(
                (async () => {
                    const htmlCache = await caches.open(HTML_CACHE);
                    const cachedRoot = await getDynamicShellFallback(htmlCache, '/');
                    if (cachedRoot) return cachedRoot;
                    const coreCache = await caches.open(CORE_CACHE);
                    return (await coreCache.match('/offline.html')) || new Response('Offline', { status: 503 });
                })()
            );
        }
        return;
    }

    // Rotas de autenticação -> bypass online; offline entrega offline.html
    const isAuthRoute = /^\/(pt|en|es)?\/(login|register|admin\/login)(\/|$)/.test(url.pathname);
    if (isAuthRoute) {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            event.respondWith(
                (async () => {
                    const coreCache = await caches.open(CORE_CACHE);
                    return (await coreCache.match('/offline.html')) || new Response('Offline', { status: 503 });
                })()
            );
        }
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 1: Next.js App Router RSC (SWR 0ms com isolamento prefetch vs nav)
    // =========================================================================
    const isRsc = request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');
    if (isRsc) {
        const isPrefetch = request.headers.get('Next-Router-Prefetch') === '1';
        const cacheKeyUrl = `${url.origin}${url.pathname}?__sw_rsc=${isPrefetch ? 'prefetch' : 'nav'}`;

        event.respondWith(
            (async () => {
                const rscCache = await caches.open(RSC_CACHE);
                const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

                // Prefetch só usa cache de prefetch; navegação usa cache de nav (nunca mistura!)
                const cachedRsc = await rscCache.match(cacheKeyUrl);

                if (!isOnline) {
                    if (cachedRsc) return cachedRsc;
                    if (!isPrefetch) {
                        const fallback = await getDynamicShellFallback(rscCache, url.pathname);
                        if (fallback) return fallback;
                    }
                    return new Response('Offline', { status: 503, statusText: 'Offline' });
                }

                const fetchFromNetwork = async () => {
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 12000);
                        const networkResponse = await fetch(request, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (!networkResponse) return null;

                        // Nunca cachear redirects (ex: 307 para /login)
                        if (
                            networkResponse.redirected ||
                            networkResponse.type === 'opaqueredirect' ||
                            (networkResponse.status >= 300 && networkResponse.status < 400)
                        ) {
                            return networkResponse;
                        }

                        if (networkResponse.status === 200) {
                            const contentType = networkResponse.headers.get('content-type') || '';
                            if (contentType.includes('text/x-component') || !contentType.includes('text/html')) {
                                await rscCache.put(cacheKeyUrl, networkResponse.clone());
                            }
                        }

                        return networkResponse;
                    } catch {
                        return null;
                    }
                };

                // Se existe cache exato, responde em 0ms e revalida silenciosamente
                if (cachedRsc) {
                    event.waitUntil(fetchFromNetwork());
                    return cachedRsc;
                }

                // Cache miss: busca na rede
                const fresh = await fetchFromNetwork();
                if (fresh) return fresh;

                // Falha de rede: tenta shell dinâmico compatível (apenas em navegação real)
                if (!isPrefetch) {
                    const fallback = await getDynamicShellFallback(rscCache, url.pathname);
                    if (fallback) return fallback;
                }

                return new Response('Offline', { status: 503, statusText: 'Offline' });
            })()
        );
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 2: Navegação HTML (SWR 0ms + detecção automática de novo deploy)
    // =========================================================================
    const isHtmlNav =
        request.mode === 'navigate' ||
        request.destination === 'document' ||
        request.headers.get('accept')?.includes('text/html');

    if (isHtmlNav) {
        const htmlCacheKey = `${url.origin}${url.pathname}`;

        event.respondWith(
            (async () => {
                const htmlCache = await caches.open(HTML_CACHE);
                const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

                const cachedHtml = await htmlCache.match(htmlCacheKey);

                if (!isOnline) {
                    if (cachedHtml) return cachedHtml;
                    const fallback = await getDynamicShellFallback(htmlCache, url.pathname);
                    if (fallback) return fallback;
                    const coreCache = await caches.open(CORE_CACHE);
                    return (await coreCache.match('/offline.html')) || new Response('Offline', { status: 503 });
                }

                const fetchHtmlFromNetwork = async (existingCachedResponse) => {
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 12000);
                        const networkResponse = await fetch(request, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (!networkResponse) return null;

                        // CRÍTICO: Nunca cachear redirects (evita gravar /login sobre /pt/home!)
                        if (
                            networkResponse.redirected ||
                            networkResponse.type === 'opaqueredirect' ||
                            (networkResponse.status >= 300 && networkResponse.status < 400)
                        ) {
                            return networkResponse;
                        }

                        if (networkResponse.status === 200) {
                            const contentType = networkResponse.headers.get('content-type') || '';
                            if (contentType.includes('text/html')) {
                                const freshCloneForCache = networkResponse.clone();
                                const freshCloneForCheck = networkResponse.clone();

                                await htmlCache.put(htmlCacheKey, freshCloneForCache);

                                // Detecta automaticamente se houve novo deploy (mudança de chunks Next.js)
                                if (existingCachedResponse) {
                                    try {
                                        const [oldText, newText] = await Promise.all([
                                            existingCachedResponse.clone().text(),
                                            freshCloneForCheck.text(),
                                        ]);
                                        const oldFp = extractBuildFingerprint(oldText);
                                        const newFp = extractBuildFingerprint(newText);

                                        if (oldFp && newFp && oldFp !== newFp) {
                                            console.log('[SW] Novo build detectado! Limpando RSC_CACHE antigo e notificando abas...');
                                            await caches.delete(RSC_CACHE);
                                            await notifyAllClients({ type: 'NEW_BUILD_DETECTED' });
                                        }
                                    } catch {
                                        // Ignora erro de comparação de texto
                                    }
                                }
                            }
                        }

                        return networkResponse;
                    } catch {
                        return null;
                    }
                };

                // Cache Hit -> entrega instantaneamente (0ms) e revalida + checa versão em background
                if (cachedHtml) {
                    event.waitUntil(fetchHtmlFromNetwork(cachedHtml));
                    return cachedHtml;
                }

                // Cache Miss -> busca da rede
                const freshHtml = await fetchHtmlFromNetwork(null);
                if (freshHtml) return freshHtml;

                // Falha de rede -> shell dinâmico ou offline.html
                const fallbackHtml = await getDynamicShellFallback(htmlCache, url.pathname);
                if (fallbackHtml) return fallbackHtml;

                const coreCache = await caches.open(CORE_CACHE);
                return (await coreCache.match('/offline.html')) || new Response('Offline', { status: 503 });
            })()
        );
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 3: Ativos Estáticos (Chunks JS/CSS, Fontes, Imagens, Áudio)
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
                const isImmutable =
                    url.pathname.startsWith('/_next/static/chunks/') ||
                    url.pathname.startsWith('/_next/static/media/');

                if (cachedResponse) {
                    if (!isImmutable) {
                        event.waitUntil(
                            fetch(request)
                                .then(async (networkResponse) => {
                                    if (networkResponse && networkResponse.status === 200) {
                                        const cache = await caches.open(STATIC_CACHE);
                                        await cache.put(request, networkResponse.clone());
                                    }
                                })
                                .catch(() => {})
                        );
                    }
                    return cachedResponse;
                }

                return fetch(request)
                    .then(async (networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const cache = await caches.open(STATIC_CACHE);
                            await cache.put(request, networkResponse.clone());
                        } else if (networkResponse && networkResponse.status === 404 && isImmutable) {
                            // Chunk do build antigo não existe mais no servidor -> avisa abas para atualizar!
                            event.waitUntil(
                                Promise.all([
                                    caches.delete(HTML_CACHE),
                                    caches.delete(RSC_CACHE),
                                    notifyAllClients({ type: 'NEW_BUILD_DETECTED' }),
                                ])
                            );
                        }
                        return networkResponse;
                    })
                    .catch(() => new Response('', { status: 408, statusText: 'Offline asset not cached' }));
            })
        );
        return;
    }

    // Fallback padrão: rede com fallback para cache
    event.respondWith(
        fetch(request).catch(async () => {
            return (await caches.match(request)) || (await caches.match(url.pathname));
        })
    );
});
