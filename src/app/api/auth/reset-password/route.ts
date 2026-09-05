import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { getResetPasswordEmail } from '@/lib/resend/emails/resetPasswordTemplate'
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getSafeOrigin(request: NextRequest): string {
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
  const host = rawHost.split(':')[0] // strip port for check if needed or match full
  const fullHost = rawHost.trim().toLowerCase()

  if (allowedHosts.has(fullHost) || allowedHosts.has(host)) {
    const proto = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https')
    return `${proto}://${fullHost}`
  }

  return process.env.NEXT_PUBLIC_SITE_URL || 'https://gymaux.radcod.com'
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers)

    // 1. Rate limiting por IP: máximo de 5 requisições a cada 15 minutos
    const ipRate = checkRateLimit(`reset_pwd_ip:${clientIp}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    })

    if (!ipRate.success) {
      return NextResponse.json(
        { error: 'Muitas solicitações a partir deste IP. Por favor, aguarde alguns minutos e tente novamente.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(ipRate.retryAfterSeconds),
            'X-RateLimit-Limit': String(ipRate.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { email, locale } = body

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'E-mail inválido ou obrigatório.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 2. Rate limiting por e-mail: máximo de 3 solicitações a cada 15 minutos
    const emailRate = checkRateLimit(`reset_pwd_email:${normalizedEmail}`, {
      limit: 3,
      windowMs: 15 * 60 * 1000,
    })

    if (!emailRate.success) {
      return NextResponse.json(
        { error: 'Limite de solicitações para este e-mail excedido. Aguarde antes de tentar novamente.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(emailRate.retryAfterSeconds),
            'X-RateLimit-Limit': String(emailRate.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables.')
      return NextResponse.json(
        { error: 'Configuração de envio de e-mail ausente no servidor.' },
        { status: 500 }
      )
    }

    const targetLocale = ['pt', 'en', 'es'].includes(locale) ? locale : 'pt'
    const origin = getSafeOrigin(request)
    const redirectTo = `${origin}/auth/callback?next=/${targetLocale}/update-password`

    // 3. Gera o link seguro de recuperação via Supabase Admin
    const supabaseAdmin = createAdminClient()
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: normalizedEmail,
      options: {
        redirectTo,
      },
    })

    // Proteção contra Account Enumeration: se o e-mail não existir, loga no servidor e responde sucesso genérico
    if (linkError || !linkData?.properties?.action_link) {
      console.warn(`[ResetPassword] Solicitação para ${normalizedEmail} não gerou link:`, linkError?.message)
      // Resposta uniforme: impede que atacantes saibam quais e-mails estão cadastrados
      return NextResponse.json({ success: true })
    }

    const resetLink = linkData.properties?.hashed_token
      ? `${origin}/auth/callback?token_hash=${linkData.properties.hashed_token}&type=recovery&next=/${targetLocale}/update-password`
      : linkData.properties.action_link

    // 4. Monta o template do e-mail com design Dark/Lime no idioma solicitado
    const { subject, html } = getResetPasswordEmail({
      email: normalizedEmail,
      resetLink,
      locale: targetLocale,
    })

    // 5. Dispara via Resend API
    const resend = new Resend(resendApiKey)
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'GymAux <noreply@radcod.com>'

    const { error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: normalizedEmail,
      subject,
      html,
    })

    if (resendError) {
      console.error('[ResetPassword] Erro ao enviar e-mail via Resend:', resendError)
      return NextResponse.json(
        { error: 'Erro ao despachar o e-mail de recuperação. Tente novamente mais tarde.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Unexpected error in reset-password endpoint:', err)
    return NextResponse.json(
      { error: 'Erro interno ao processar a solicitação.' },
      { status: 500 }
    )
  }
}
