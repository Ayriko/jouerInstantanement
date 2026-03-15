import { Injectable } from '@nestjs/common';
import { UserRegisteredPayload } from '@repo/mail';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailService {
    private readonly client: InstanceType<typeof Mailjet>;
    private readonly from = {
        Email: process.env.MAIL_FROM ?? 'noreply@JouerInstantanément.com',
        Name: 'JouerInstantanément',
    };

    constructor() {
        this.client = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY!,
            process.env.MAILJET_SECRET_KEY!,
        );
    }

    // ─── Helpers ─────────────────────────────────────────────

    private async sendHtml(
        to: string,
        subject: string,
        html: string,
        text: string,
    ) {
        await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: this.from,
                    Subject: subject,
                    HTMLPart: html,
                    TextPart: text,
                    To: [{ Email: to }],
                },
            ],
        });
    }

    // ─── Méthodes publiques ───────────────────────────────────

    async sendUserRegistered(data: UserRegisteredPayload) {
        const subject = `Bienvenue ${data.username} 🎮`;
        const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#0f0f13;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f13;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a24;border-radius:12px;overflow:hidden;max-width:600px;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6c47ff,#a855f7);padding:40px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:-0.5px;">🎮 JouerInstantanément</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 32px;color:#e2e8f0;">
            <h2 style="margin:0 0 16px;color:#fff;font-size:22px;">Bienvenue, ${data.username} !</h2>
            <p style="margin:0 0 24px;line-height:1.6;color:#94a3b8;">
              Ton compte a bien été créé sur <strong style="color:#a855f7;">JouerInstantanément</strong>.
              Tu peux dès maintenant explorer notre catalogue et jouer instantanément.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#6c47ff;border-radius:8px;padding:14px 28px;">
                  <a href="${process.env.FRONTEND_URL ?? 'http://localhost:3001'}" style="color:#fff;text-decoration:none;font-weight:600;font-size:15px;">
                    Accéder à ma bibliothèque →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #2d2d3d;text-align:center;color:#475569;font-size:12px;">
            Tu reçois cet e-mail car tu viens de créer un compte JouerInstantanément.<br/>
            © ${new Date().getFullYear()} JouerInstantanément — Tous droits réservés
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

        const text = `Bienvenue ${data.username} !\n\nTon compte JouerInstantanément a bien été créé.\nAccède à ta bibliothèque : ${process.env.FRONTEND_URL ?? 'http://localhost:3001'}\n\n© ${new Date().getFullYear()} JouerInstantanément`;

        await this.sendHtml(data.email, subject, html, text);
    }
}
