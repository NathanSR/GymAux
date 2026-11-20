/**
 * GymAux - Service Worker Nativo Local-First (Web Standards)
 * - Separação estrita entre CORE_CACHE, HTML_CACHE, RSC_CACHE e STATIC_CACHE.
 * - Isolamento de payloads RSC de prefetch vs navegação real (Next.js 16 App Router).
 * - Shells dinâmicos universais com reescrita cirúrgica de IDs em HTML & RSC Flight
 *   (permite criar/editar/ver/iniciar qualquer item offline mesmo sem nunca ter visitado a URL online).
 * - Precache automático de chunks /_next/static/(chunks|css) descobertos no HTML.
 * - Detecção automática de novos deploys via fingerprint de chunks (zero páginas obsoletas).
 * - Nunca armazena respostas redirecionadas (previne cachear /login sobre /home).
 * - Suporte multi-idioma (/pt, /en, /es) e rotas de aluno + treinador.
 */

const CACHE_VERSION = 'gymaux-v6.1.0';
const CORE_CACHE = `gymaux-core-${CACHE_VERSION}`;
const HTML_CACHE = `gymaux-html-${CACHE_VERSION}`;
const RSC_CACHE = `gymaux-rsc-${CACHE_VERSION}`;
const STATIC_CACHE = `gymaux-static-${CACHE_VERSION}`;

const SHELL_ID = '__gymaux_shell__';
const STUDENT_SHELL_ID = '__gymaux_student__';
const SENTINEL_TOKENS = new Set([SHELL_ID, STUDENT_SHELL_ID]);

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
 * Registro de templates de rotas dinâmicas (mais específicas primeiro).
 * Permite servir qualquer rota dinâmica offline reescrevendo o placeholder do shell
 * para o ID real requisitado, tanto no payload RSC Flight quanto no documento HTML.
 */
const DYNAMIC_ROUTE_TEMPLATES = [
    // --- Rotas de Treinador (mais específicas primeiro) ---
    {
        name: 'trainer-workout-edit',
        paramNames: ['studentId', 'workoutId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/workouts/([^/]+)/edit$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/workouts/${SHELL_ID}/edit`,
    },
    {
        name: 'trainer-workout-new',
        paramNames: ['studentId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/workouts/new$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/workouts/new`,
    },
    {
        name: 'trainer-workouts',
        paramNames: ['studentId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/workouts$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/workouts`,
    },
    {
        name: 'trainer-schedule-edit',
        paramNames: ['studentId', 'scheduleId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/schedule/([^/]+)/edit$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/schedule/${SHELL_ID}/edit`,
    },
    {
        name: 'trainer-schedule-new',
        paramNames: ['studentId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/schedule/new$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/schedule/new`,
    },
    {
        name: 'trainer-schedule',
        paramNames: ['studentId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/schedule$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/schedule`,
    },
    {
        name: 'trainer-history',
        paramNames: ['studentId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/history$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/history`,
    },
    {
        name: 'trainer-session',
        paramNames: ['studentId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)/session$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}/session`,
    },
    {
        name: 'trainer-student',
        paramNames: ['studentId'],
        pattern: (locale) => new RegExp(`^/${locale}/trainer/([^/]+)$`),
        shellPath: (locale) => `/${locale}/trainer/${STUDENT_SHELL_ID}`,
    },

    // --- Rotas Dinâmicas do Usuário ---
    {
        name: 'session',
        paramNames: ['id'],
        pattern: (locale) => new RegExp(`^/${locale}/session/([^/]+)$`),
        shellPath: (locale) => `/${locale}/session/${SHELL_ID}`,
    },
    {
        name: 'workout-edit',
        paramNames: ['id'],
        pattern: (locale) => new RegExp(`^/${locale}/workouts/([^/]+)/edit$`),
        shellPath: (locale) => `/${locale}/workouts/${SHELL_ID}/edit`,
    },
    {
        name: 'schedule-edit',
        paramNames: ['id'],
        pattern: (locale) => new RegExp(`^/${locale}/schedules/([^/]+)/edit$`),
        shellPath: (locale) => `/${locale}/schedules/${SHELL_ID}/edit`,
    },
    {
        name: 'exercise-edit',
        paramNames: ['id'],
        pattern: (locale) => new RegExp(`^/${locale}/exercises/([^/]+)/edit$`),
        shellPath: (locale) => `/${locale}/exercises/${SHELL_ID}/edit`,
    },
    {
        name: 'exercise-detail',
        paramNames: ['id'],
        pattern: (locale) => new RegExp(`^/${locale}/exercises/(?!new$)([^/]+)$`),
        shellPath: (locale) => `/${locale}/exercises/${SHELL_ID}`,
    },
];

/**
 * Extrai assinatura dos chunks do build Next.js presentes no HTML para detectar novos deploys.
 */
function extractBuildFingerprint(htmlText) {
    if (!htmlText) return null;
    const matches = htmlText.match(/\/_next\/static\/chunks\/[a-zA-Z0-9_\-\.]+\.js/g);
    if (!matches || matches.length === 0) return null;
    return Array.from(new Set(matches)).sort().slice(0, 6).join('|');
}

/**
 * Descobre e pré-cacheia chunks JS/CSS /_next/static/ referenciados no HTML.
 * Garante que páginas pré-aquecidas (incluindo shells dinâmicos nunca visitados)
 * tenham 100% dos scripts/estilos no STATIC_CACHE ao entrar em modo offline.
 */
async function cacheStaticAssetsFromHtml(htmlText) {
    if (!htmlText) return;
    try {
        const assetMatches = htmlText.match(/\/_next\/static\/(?:chunks|css)\/[^"'\s<>\\]+\.(?:js|css)/g);
        if (!assetMatches || assetMatches.length === 0) return;

        const uniqueAssets = Array.from(new Set(assetMatches));
        const staticCache = await caches.open(STATIC_CACHE);

        const CONCURRENCY = 4;
        for (let i = 0; i < uniqueAssets.length; i += CONCURRENCY) {
            const batch = uniqueAssets.slice(i, i + CONCURRENCY);
            await Promise.allSettled(
                batch.map(async (assetPath) => {
                    const assetUrl = `${self.location.origin}${assetPath}`;
                    const existing = await staticCache.match(assetUrl, { ignoreVary: true });
                    if (existing) return;
                    try {
                        const res = await fetch(assetUrl, { credentials: 'same-origin' });
                        if (res && res.status === 200) {
                            await staticCache.put(assetUrl, res);
                        }
                    } catch {
                        // Ignore transient asset fetch failures
                    }
                })
            );
        }
    } catch {
        // Ignore HTML asset scan errors
    }
}

async function drainBgTasks(tasks) {
    while (tasks.length > 0) {
        const batch = tasks.splice(0, tasks.length);
        await Promise.allSettled(batch);
    }
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

/**
 * Busca no cache uma entrada compatível com o padrão da rota.
 * Quando rscMode é informado (ex: 'nav'), garante que NUNCA devolve payload 'prefetch' para navegação real.
 */
async function findCachedByPattern(cache, pattern, options = {}) {
    try {
        const keys = await cache.keys();
        for (const req of keys) {
            const reqUrl = new URL(req.url);
            if (options.rscMode) {
                if (reqUrl.searchParams.get('__sw_rsc') !== options.rscMode) {
                    continue;
                }
            }
            if (pattern.test(reqUrl.pathname)) {
                const response = await cache.match(req);
                if (response) {
                    return { response, pathname: reqUrl.pathname };
                }
            }
        }
    } catch {
        // Ignore cache read errors
    }
    return null;
}

function sanitizeParamValue(val) {
    if (!val) return '';
    try {
        const decoded = decodeURIComponent(val);
        // Rejeita caracteres que poderiam quebrar JSON/Flight
        if (/["\\\r\n<>]/.test(decoded)) {
            return val.replace(/["\\\r\n<>]/g, '');
        }
        return decoded;
    } catch {
        return val.replace(/["\\\r\n<>]/g, '');
    }
}

/**
 * Reescreve os segmentos dinâmicos de um shell HTML ou RSC Flight cacheado
 * para corresponder exatamente aos IDs da URL solicitada pelo usuário.
 */
async function rewriteDynamicResponse(cachedResponse, cachedPathname, targetPathname, template, locale) {
    try {
        const regex = template.pattern(locale);
        const cachedMatch = cachedPathname.match(regex);
        const targetMatch = targetPathname.match(regex);

        if (!cachedMatch || !targetMatch) {
            return cachedResponse;
        }

        let bodyText = await cachedResponse.text();
        let mutated = false;

        for (let i = 0; i < template.paramNames.length; i++) {
            const paramName = template.paramNames[i];
            const cachedVal = cachedMatch[i + 1];
            const targetVal = sanitizeParamValue(targetMatch[i + 1]);

            if (!cachedVal || !targetVal || cachedVal === targetVal) continue;

            if (SENTINEL_TOKENS.has(cachedVal)) {
                // Sentinelas exclusivos (__gymaux_shell__ / __gymaux_student__): substituição global 100% segura
                if (bodyText.includes(cachedVal)) {
                    bodyText = bodyText.split(cachedVal).join(targetVal);
                    mutated = true;
                }
            } else {
                // Fallback quando só havia um ID real cacheado: substituições cirúrgicas em Flight/JSON
                const targetedPairs = [
                    [`["${paramName}","${cachedVal}","d"]`, `["${paramName}","${targetVal}","d"]`],
                    [`[\\"${paramName}\\",\\"${cachedVal}\\",\\"d\\"]`, `[\\"${paramName}\\",\\"${targetVal}\\",\\"d\\"]`],
                    [`"${paramName}":"${cachedVal}"`, `"${paramName}":"${targetVal}"`],
                    [`\\"${paramName}\\":\\"${cachedVal}\\"`, `\\"${paramName}\\":\\"${targetVal}\\"`],
                ];

                for (const [from, to] of targetedPairs) {
                    if (bodyText.includes(from)) {
                        bodyText = bodyText.split(from).join(to);
                        mutated = true;
                    }
                }

                // Para UUIDs longos (>= 16 chars), também substitui referências diretas de path
                if (cachedVal.length >= 16 && bodyText.includes(cachedVal)) {
                    bodyText = bodyText.split(cachedVal).join(targetVal);
                    mutated = true;
                }
            }
        }

        const headers = new Headers(cachedResponse.headers);
        headers.delete('content-length');
        headers.delete('content-encoding');
        headers.delete('etag');
        headers.set('x-sw-dynamic-shell', mutated ? 'rewritten' : 'passthrough');

        return new Response(bodyText, {
            status: cachedResponse.status || 200,
            statusText: cachedResponse.statusText || 'OK',
            headers,
        });
    } catch {
        return cachedResponse;
    }
}

async function getDynamicShellFallback(cache, pathname, options = {}) {
    const locale = extractLocale(pathname);

    if (pathname === '/' || pathname === '') {
        return (
            (await cache.match(`/${locale}/home`)) ||
            (await cache.match('/pt/home')) ||
            (await cache.match('/en/home')) ||
            (await cache.match('/es/home'))
        );
    }

    for (const template of DYNAMIC_ROUTE_TEMPLATES) {
        const regex = template.pattern(locale);
        if (!regex.test(pathname)) continue;

        const shellPathname = template.shellPath(locale);
        const shellKey = options.rscMode
            ? `${self.location.origin}${shellPathname}?__sw_rsc=${options.rscMode}`
            : `${self.location.origin}${shellPathname}`;

        // 1. Prioridade máxima: shell sentinela canônico pré-aquecido (árvore completa + substituição 100% segura)
        const exactShell = await cache.match(shellKey);
        if (exactShell) {
            return await rewriteDynamicResponse(exactShell, shellPathname, pathname, template, locale);
        }

        // 2. Fallback: qualquer rota dinâmica do mesmo template já visitada anteriormente
        const patternHit = await findCachedByPattern(cache, regex, options);
        if (patternHit) {
            return await rewriteDynamicResponse(patternHit.response, patternHit.pathname, pathname, template, locale);
        }

        // 3. Fallback extra apenas para HTML de detalhe de exercício
        if (!options.rscMode && template.name === 'exercise-detail') {
            return await cache.match(`${self.location.origin}/${locale}/exercises`);
        }

        return null;
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
    // ESTRATÉGIA 1: Next.js App Router RSC (SWR 0ms + shell dinâmico reescrito)
    // =========================================================================
    const isRsc = request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');
    if (isRsc) {
        const isPrefetch =
            request.headers.get('Next-Router-Prefetch') === '1' ||
            Boolean(request.headers.get('Next-Router-Segment-Prefetch'));
        const rscMode = isPrefetch ? 'prefetch' : 'nav';
        const cacheKeyUrl = `${url.origin}${url.pathname}?__sw_rsc=${rscMode}`;

        const bgTasks = [];
        let markResponseReady;
        const responseReady = new Promise((resolve) => {
            markResponseReady = resolve;
        });
        event.waitUntil(responseReady.then(() => drainBgTasks(bgTasks)));

        event.respondWith(
            (async () => {
                try {
                    const rscCache = await caches.open(RSC_CACHE);
                    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

                    // Prefetch só usa cache de prefetch; navegação usa cache de nav (nunca mistura!)
                    const cachedRsc = await rscCache.match(cacheKeyUrl);

                    if (!isOnline) {
                        if (cachedRsc) return cachedRsc;
                        if (!isPrefetch) {
                            const fallback = await getDynamicShellFallback(rscCache, url.pathname, { rscMode: 'nav' });
                            if (fallback) return fallback;
                        }
                        return new Response('Offline', { status: 503, statusText: 'Offline' });
                    }

                    const fetchFromNetwork = async () => {
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 8000);
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
                        bgTasks.push(fetchFromNetwork());
                        return cachedRsc;
                    }

                    // Cache miss: busca na rede
                    const fresh = await fetchFromNetwork();
                    if (fresh) return fresh;

                    // Falha de rede / timeout: serve shell dinâmico compatível (apenas em navegação real)
                    if (!isPrefetch) {
                        const fallback = await getDynamicShellFallback(rscCache, url.pathname, { rscMode: 'nav' });
                        if (fallback) return fallback;
                    }

                    return new Response('Offline', { status: 503, statusText: 'Offline' });
                } finally {
                    markResponseReady();
                }
            })()
        );
        return;
    }

    // =========================================================================
    // ESTRATÉGIA 2: Navegação HTML (SWR 0ms + shell dinâmico + precache de chunks)
    // =========================================================================
    const isHtmlNav =
        request.mode === 'navigate' ||
        request.destination === 'document' ||
        request.headers.get('accept')?.includes('text/html');

    if (isHtmlNav) {
        const htmlCacheKey = `${url.origin}${url.pathname}`;

        const bgTasks = [];
        let markResponseReady;
        const responseReady = new Promise((resolve) => {
            markResponseReady = resolve;
        });
        event.waitUntil(responseReady.then(() => drainBgTasks(bgTasks)));

        event.respondWith(
            (async () => {
                try {
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
                            const timeoutId = setTimeout(() => controller.abort(), 8000);
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
                                    const freshCloneForScan = networkResponse.clone();

                                    await htmlCache.put(htmlCacheKey, freshCloneForCache);

                                    // Em background (sem travar a resposta): (1) pré-cacheia chunks JS/CSS e (2) detecta novo deploy
                                    bgTasks.push(
                                        (async () => {
                                            try {
                                                const newText = await freshCloneForScan.text();
                                                await cacheStaticAssetsFromHtml(newText);

                                                if (existingCachedResponse) {
                                                    const oldText = await existingCachedResponse.clone().text();
                                                    const oldFp = extractBuildFingerprint(oldText);
                                                    const newFp = extractBuildFingerprint(newText);

                                                    if (oldFp && newFp && oldFp !== newFp) {
                                                        console.log('[SW] Novo build detectado! Limpando RSC_CACHE antigo e notificando abas...');
                                                        await caches.delete(RSC_CACHE);
                                                        await notifyAllClients({ type: 'NEW_BUILD_DETECTED' });
                                                    }
                                                }
                                            } catch {
                                                // Ignora erro de análise em background
                                            }
                                        })()
                                    );
                                }
                            }

                            return networkResponse;
                        } catch {
                            return null;
                        }
                    };

                    // Cache Hit -> entrega instantaneamente (0ms) e revalida + checa versão em background
                    if (cachedHtml) {
                        bgTasks.push(fetchHtmlFromNetwork(cachedHtml));
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
                } finally {
                    markResponseReady();
                }
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
        const bgTasks = [];
        let markResponseReady;
        const responseReady = new Promise((resolve) => {
            markResponseReady = resolve;
        });
        event.waitUntil(responseReady.then(() => drainBgTasks(bgTasks)));

        event.respondWith(
            (async () => {
                try {
                    const cachedResponse = await caches.match(request, { ignoreVary: true });
                    const isImmutable =
                        url.pathname.startsWith('/_next/static/chunks/') ||
                        url.pathname.startsWith('/_next/static/media/');

                    if (cachedResponse) {
                        if (!isImmutable) {
                            bgTasks.push(
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

                    try {
                        const networkResponse = await fetch(request);
                        if (networkResponse && networkResponse.status === 200) {
                            const cache = await caches.open(STATIC_CACHE);
                            await cache.put(request, networkResponse.clone());
                        } else if (networkResponse && networkResponse.status === 404 && isImmutable) {
                            // Chunk do build antigo não existe mais no servidor -> avisa abas para atualizar!
                            bgTasks.push(
                                Promise.all([
                                    caches.delete(HTML_CACHE),
                                    caches.delete(RSC_CACHE),
                                    notifyAllClients({ type: 'NEW_BUILD_DETECTED' }),
                                ])
                            );
                        }
                        return networkResponse;
                    } catch {
                        return new Response('', { status: 408, statusText: 'Offline asset not cached' });
                    }
                } finally {
                    markResponseReady();
                }
            })()
        );
        return;
    }

    // Fallback padrão: rede com fallback para cache
    event.respondWith(
        fetch(request).catch(async () => {
            return (await caches.match(request, { ignoreVary: true })) || (await caches.match(url.pathname));
        })
    );
});
