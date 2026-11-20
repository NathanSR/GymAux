/**
 * Fonte única de verdade para o ID do usuário autenticado no dispositivo.
 * Evita qualquer dependência de `db.users.toCollection().first()`, que quebra
 * quando perfis de alunos ou contatos são cacheados na tabela `db.users`.
 */

const ACTIVE_AUTH_USER_KEY = 'gymaux_active_auth_user_id';

export function getStoredActiveAuthUserId(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const val = localStorage.getItem(ACTIVE_AUTH_USER_KEY);
        return val && val.trim().length > 0 ? val.trim() : null;
    } catch {
        return null;
    }
}

export function setStoredActiveAuthUserId(userId: string): void {
    if (typeof window === 'undefined' || !userId) return;
    try {
        localStorage.setItem(ACTIVE_AUTH_USER_KEY, userId);
    } catch {
        // Ignore storage errors (private mode / quota)
    }
}

export function clearStoredActiveAuthUserId(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(ACTIVE_AUTH_USER_KEY);
    } catch {
        // Ignore storage errors
    }
}

/**
 * Resolve o ID real de uma rota dinâmica priorizando `window.location.pathname`
 * (essencial quando o Service Worker serve um shell HTML/RSC genérico offline).
 */
export function resolveDynamicRouteId(
    pattern: RegExp,
    pathname: string | null | undefined,
    paramId: string | undefined,
    excluded: string[] = ['template', 'shell']
): string {
    const isValid = (val?: string | null): val is string =>
        Boolean(val && !excluded.includes(val));

    if (typeof window !== 'undefined' && window.location.pathname) {
        const winMatch = window.location.pathname.match(pattern);
        if (winMatch && isValid(winMatch[1])) {
            return winMatch[1];
        }
    }

    if (pathname) {
        const pathMatch = pathname.match(pattern);
        if (pathMatch && isValid(pathMatch[1])) {
            return pathMatch[1];
        }
    }

    return isValid(paramId) ? paramId : (paramId || '');
}
