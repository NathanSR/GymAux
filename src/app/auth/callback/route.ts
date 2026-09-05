import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'
import { type EmailOtpType } from '@supabase/supabase-js'

function getSafeOrigin(request: NextRequest, fallbackOrigin: string): string {
  const allowedHosts = new Set([
    'gymaux.radcod.com',
    'gymaux-app.vercel.app',
    'localhost:3000',
    '127.0.0.1:3000',
  ])

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowedHosts.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host)
    } catch {}
  }

  const rawHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const host = rawHost.split(':')[0]
  const fullHost = rawHost.trim().toLowerCase()

  if (allowedHosts.has(fullHost) || allowedHosts.has(host)) {
    const proto = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https')
    return `${proto}://${fullHost}`
  }

  return fallbackOrigin || process.env.NEXT_PUBLIC_SITE_URL || 'https://gymaux.radcod.com'
}

function sanitizeNextUrl(rawNext: string | null): string {
  if (!rawNext) return '/update-password'
  const trimmed = rawNext.trim()

  // Deve iniciar estritamente com '/' e não com '//' ou '/\'
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return '/update-password'
  }

  // Não pode conter dois pontos antes de query string (evita javascript:, https:, etc.)
  const pathPart = trimmed.split('?')[0]
  if (pathPart.includes(':')) {
    return '/update-password'
  }

  return trimmed
}

export async function GET(request: NextRequest) {
  const { searchParams, origin: rawOrigin } = new URL(request.url)
  const safeOrigin = getSafeOrigin(request, rawOrigin)

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = sanitizeNextUrl(searchParams.get('next'))

  const supabase = await createClient()

  // 1. Tratamento de fluxo PKCE (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return redirectToTarget(safeOrigin, next)
    }
  }

  // 2. Tratamento de fluxo com token_hash (ex: recovery, email_change, etc.)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return redirectToTarget(safeOrigin, next)
    }
  }

  // Redireciona para a página de login se o token for inválido ou expirado
  return NextResponse.redirect(`${safeOrigin}/${routing.defaultLocale}/login?error=auth_callback_error`)
}

function redirectToTarget(safeOrigin: string, next: string) {
  const hasLocale = routing.locales.some(
    (loc) => next === `/${loc}` || next.startsWith(`/${loc}/`)
  )
  const targetPath = hasLocale
    ? next
    : `/${routing.defaultLocale}${next.startsWith('/') ? '' : '/'}${next}`

  return NextResponse.redirect(`${safeOrigin}${targetPath}`)
}
