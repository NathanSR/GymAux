'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { db } from '@/config/db';
import { createClient } from '@/lib/supabase/client';

/**
 * AuthRouteGuard Component
 * 
 * Protege rotas de autenticação (/login, /register) no lado do cliente:
 * 1. Checa o Dexie local imediatamente (0ms Local-First)
 * 2. Checa a sessão do Supabase no cliente
 * Se o usuário já estiver autenticado, redireciona para /home via router.replace
 * evitando flash do formulário de login e mantendo integridade com o modo offline.
 */
export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [canShowAuth, setCanShowAuth] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const verifyAuth = async () => {
            try {
                // 1. Checagem Local-First ultra-rápida (0ms Dexie)
                if (typeof window !== 'undefined') {
                    const localUser = await db.users.toCollection().first().catch(() => null);
                    if (localUser) {
                        router.replace('/home');
                        return;
                    }
                }

                // 2. Checagem da sessão ativa do Supabase no cliente
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
                if (session?.user) {
                    router.replace('/home');
                    return;
                }

                if (isMounted) {
                    setCanShowAuth(true);
                    setChecking(false);
                }
            } catch {
                if (isMounted) {
                    setCanShowAuth(true);
                    setChecking(false);
                }
            }
        };

        verifyAuth();

        return () => {
            isMounted = false;
        };
    }, [router]);

    if (checking && !canShowAuth) {
        return null;
    }

    return <>{children}</>;
}
