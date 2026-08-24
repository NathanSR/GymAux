import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { getResetPasswordEmail } from '@/lib/resend/emails/resetPasswordTemplate'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, locale } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'E-mail inválido ou obrigatório.' },
        { status: 400 }
      )
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables.')
      return NextResponse.json(
        { error: 'Configuração de e-mail (RESEND_API_KEY) ausente no servidor.' },
        { status: 500 }
      )
    }

    const targetLocale = ['pt', 'en', 'es'].includes(locale) ? locale : 'pt'

    // Determina a origem base (em produção usa o domínio oficial ou header de proxy)
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https')
    const origin = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://gymaux.radcod.com')

    const redirectTo = `${origin}/auth/callback?next=/${targetLocale}/update-password`

    // 1. Gera o link seguro de recuperação pelo Supabase Admin (sem enviar e-mail nativo do Supabase)
    const supabaseAdmin = createAdminClient()
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo,
      },
    })

    if (linkError || !linkData?.properties?.action_link) {
      console.error('Error generating recovery link from Supabase:', linkError)
      return NextResponse.json(
        { error: linkError?.message || 'Erro ao gerar o link de recuperação.' },
        { status: 400 }
      )
    }

    // Se houver hashed_token, constrói o link DIRETO para o nosso domínio
    // evitando qualquer intermediário ou redirecionamento do servidor Supabase para localhost
    const resetLink = linkData.properties?.hashed_token
      ? `${origin}/auth/callback?token_hash=${linkData.properties.hashed_token}&type=recovery&next=/${targetLocale}/update-password`
      : linkData.properties.action_link

    // 2. Monta o template do e-mail com design Dark/Lime no idioma solicitado
    const { subject, html } = getResetPasswordEmail({
      email,
      resetLink,
      locale: targetLocale,
    })

    // 3. Dispara diretamente via Resend API
    const resend = new Resend(resendApiKey)
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'GymAux <noreply@radcod.com>'

    const { error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject,
      html,
    })

    if (resendError) {
      console.error('Error sending email via Resend:', resendError)
      return NextResponse.json(
        { error: `Erro ao enviar e-mail via Resend: ${resendError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Unexpected error in reset-password endpoint:', err)
    return NextResponse.json(
      { error: err.message || 'Erro interno no servidor.' },
      { status: 500 }
    )
  }
}
