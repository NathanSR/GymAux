import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/update-password'

  const supabase = await createClient()

  // 1. Tratamento de fluxo PKCE (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return redirectToTarget(request, origin, next)
    }
  }

  // 2. Tratamento de fluxo com token_hash (ex: recovery, email_change, etc.)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return redirectToTarget(request, origin, next)
    }
  }

  // Redireciona para a página de login se o token for inválido ou expirado
  return NextResponse.redirect(`${origin}/${routing.defaultLocale}/login?error=auth_callback_error`)
}

function redirectToTarget(request: NextRequest, origin: string, next: string) {
  const hasLocale = routing.locales.some(
    (loc) => next === `/${loc}` || next.startsWith(`/${loc}/`)
  )
  const targetPath = hasLocale
    ? next
    : `/${routing.defaultLocale}${next.startsWith('/') ? '' : '/'}${next}`

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${targetPath}`)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${targetPath}`)
  } else {
    return NextResponse.redirect(`${origin}${targetPath}`)
  }
}
