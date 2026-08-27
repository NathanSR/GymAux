/**
 * GymAux - Service Worker Nativo (Web Standards)
 * Cache inteligente de App Shell, mídia do timer e resiliência offline.
 * Zero vazamento de dados de autenticação ou APIs do Supabase.
 */

const CACHE_VERSION = 'gymaux-v1.0.0';
const CORE_CACHE = `gymaux-core-${CACHE_VERSION}`;
const STATIC_CACHE = `gymaux-static-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.ico',
    '/offline.html',
    '/logo.png',
    '/sounds/3-2-1-ja.mp3',
    '/ios/180.png',
    '/ios/192.png',
    '/ios/512.png',
];

// 1. Instalação: Pré-cache de recursos críticos do App Shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CORE_CACHE).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[SW] Falha ao pré-cachear alguns assets não essenciais:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// 2. Ativação: Limpeza imediata de versões antigas de cache
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key.startsWith('gymaux-') && key !== CORE_CACHE && key !== STATIC_CACHE) {
                        console.log('[SW] Removendo cache antigo:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Comunicação: Suporte a comandos da aplicação cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 4. Interceptação de Requisições de Rede
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // SEGURANÇA 1: Ignora requisições não-GET (POST, PUT, DELETE, PATCH)
    if (request.method !== 'GET') {
        return;
    }

    // SEGURANÇA 2: Bypass TOTAL para APIs do Supabase, Auth e rotas /api/
    // O Dexie.js (SyncManager) é o único responsável pelos dados offline.
    const isSupabase = url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in');
    const isApiRoute = url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/');
    if (isSupabase || isApiRoute) {
        return;
    }

    // ESTRATÉGIA A: Navegações HTML (App Shell / Troca de páginas)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Se a resposta for válida, salva uma cópia leve no cache estático
                    if (response && response.status === 200 && response.type === 'basic') {
                        const responseToCache = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(async () => {
                    // Sem internet: Tenta servir a página em cache ou fallback offline
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    const offlinePage = await caches.match('/offline.html');
                    return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
                })
        );
        return;
    }

    // ESTRATÉGIA B: Arquivos Estáticos imutáveis do Next.js (_next/static/*), Áudios, Fontes e Ícones
    const isStaticAsset =
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/sounds/') ||
        url.pathname.startsWith('/ios/') ||
        url.pathname.startsWith('/windows11/') ||
        url.pathname.startsWith('/android/') ||
        /\.(?:png|jpg|jpeg|svg|gif|webp|woff2?|ico|mp3|wav|ogg)$/i.test(url.pathname);

    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                // Stale-While-Revalidate para assets estáticos
                const fetchPromise = fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(STATIC_CACHE).then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Padrão: Busca na rede com fallback de cache se disponível
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});
