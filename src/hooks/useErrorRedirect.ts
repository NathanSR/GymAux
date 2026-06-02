'use client';

import { usePathname } from '@/i18n/routing';

/** 
 * Segments that belong to the private authenticated area (user).
 * Rotas que pertencem à área privada autenticada do usuário.
 */
const PRIVATE_USER_SEGMENTS = [
  'home', 'exercises', 'history', 'profile',
  'schedules', 'session', 'workouts',
];

/**
 * Resolves the correct "safe home" href based on the current route context.
 *
 * - Trainer area  → /trainer
 * - Authenticated → /home
 * - Public/other  → /
 */
export function useErrorRedirect(): '/' | '/home' | '/trainer' {
  const pathname = usePathname();

  // Pathname from next-intl's usePathname() is locale-stripped, e.g. "/trainer/abc"
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment === 'trainer') return '/trainer';

  if (firstSegment && PRIVATE_USER_SEGMENTS.includes(firstSegment)) return '/home';

  return '/';
}
