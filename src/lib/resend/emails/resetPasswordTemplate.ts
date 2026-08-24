interface ResetPasswordEmailParams {
  email: string
  resetLink: string
  locale?: string
}

export function getResetPasswordEmail({ email, resetLink, locale = 'pt' }: ResetPasswordEmailParams) {
  const isEn = locale === 'en'
  const isEs = locale === 'es'

  const subject = isEn
    ? 'Reset your GymAux password'
    : isEs
    ? 'Restablecer tu contraseña - GymAux'
    : 'Redefinição de Senha - GymAux'

  const title = isEn
    ? 'Reset Your Password'
    : isEs
    ? 'Restablece tu Contraseña'
    : 'Redefinição de Senha'

  const description = isEn
    ? `We received a request to reset the password for your GymAux account (<strong style="color: #ffffff;">${email}</strong>). Click the button below to choose a new password.`
    : isEs
    ? `Recibimos una solicitud para restablecer la contraseña de tu cuenta de GymAux (<strong style="color: #ffffff;">${email}</strong>). Haz clic en el botón de abajo para elegir una nueva contraseña.`
    : `Recebemos uma solicitação para redefinir a senha da sua conta no GymAux (<strong style="color: #ffffff;">${email}</strong>). Clique no botão abaixo para escolher uma nova senha.`

  const buttonText = isEn
    ? 'Reset Password'
    : isEs
    ? 'Restablecer Contraseña'
    : 'Redefinir Minha Senha'

  const warning = isEn
    ? "If you didn't request this change, you can safely ignore this email. The link is valid for 24 hours."
    : isEs
    ? 'Si no solicitaste este cambio, puedes ignorar este correo con seguridad. El enlace expira en 24 horas.'
    : 'Se você não fez essa solicitação, pode ignorar este e-mail com segurança. O link é válido por 24 horas.'

  const fallbackLabel = isEn
    ? 'Having trouble with the button? Copy and paste this URL into your browser:'
    : isEs
    ? '¿Problemas con el botón? Copia y pega este enlace en tu navegador:'
    : 'Problemas com o botão? Cole este link no seu navegador:'

  const footerText = isEn
    ? 'GymAux &copy; 2026 &bull; Your ultimate workout assistant.'
    : isEs
    ? 'GymAux &copy; 2026 &bull; Tu asistente de entrenamiento definitivo.'
    : 'GymAux &copy; 2026 &bull; Seu auxílio nos treinos.'

  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #18181b; border: 1px solid #27272a; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- LOGO HEADER -->
          <tr>
            <td align="center" style="padding: 36px 32px 16px 32px;">
              <div style="display: inline-block; background-color: #84cc16; color: #000000; font-weight: 900; font-style: italic; font-size: 24px; padding: 10px 24px; border-radius: 14px; letter-spacing: -0.5px; text-transform: uppercase;">
                GYMAUX
              </div>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center;">
              <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 20px 0 12px 0; letter-spacing: -0.5px; font-style: italic;">
                ${title}
              </h1>

              <p style="font-size: 14px; line-height: 24px; color: #a1a1aa; margin: 0 0 28px 0;">
                ${description}
              </p>

              <!-- CTA BUTTON -->
              <div style="margin: 32px 0;">
                <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #84cc16; color: #000000 !important; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; padding: 16px 36px; border-radius: 14px; box-shadow: 0 10px 25px rgba(132, 204, 22, 0.25);">
                  ${buttonText} &rarr;
                </a>
              </div>

              <!-- WARNING -->
              <p style="font-size: 12px; color: #71717a; line-height: 18px; margin: 0 0 24px 0;">
                ${warning}
              </p>

              <!-- FALLBACK LINK BOX -->
              <div style="background-color: #09090b; border: 1px solid #27272a; border-radius: 14px; padding: 14px; text-align: left;">
                <div style="font-size: 11px; color: #71717a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                  ${fallbackLabel}
                </div>
                <a href="${resetLink}" style="font-size: 12px; color: #84cc16; word-break: break-all; text-decoration: underline;">
                  ${resetLink}
                </a>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="border-top: 1px solid #27272a; padding: 20px 32px; background-color: #121215; font-size: 12px; color: #71717a;">
              ${footerText}<br>
              <span style="font-size: 10px; color: #52525b; margin-top: 4px; display: inline-block;">RADCOD Platforms &bull; Automated Security Notice</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  return {
    subject,
    html,
  }
}
