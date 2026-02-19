import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.ethereal.email'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  private get fromAddress(): string {
    return this.configService.get<string>(
      'MAIL_FROM',
      'Vite & Gourmand <noreply@viteetgourmand.fr>',
    );
  }

  private get frontendUrl(): string {
    return this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3001',
    );
  }

  private get baseImageUrl(): string {
    return 'https://vite-et-gourmand-rust.vercel.app/images';
  }

  private layout(content: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#faf7f2;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header with storefront photo -->
          <tr>
            <td style="border-radius:12px 12px 0 0;padding:0;overflow:hidden;background-image:url('${this.baseImageUrl}/contact.jpg');background-size:cover;background-position:center 70%;">
              <!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;"><v:fill type="frame" src="${this.baseImageUrl}/contact.jpg" /><v:textbox inset="0,0,0,0"><![endif]-->
              <div style="background:linear-gradient(to bottom, rgba(180,83,9,0.72) 0%, rgba(120,53,3,0.78) 100%);padding:48px 0;border-radius:12px 12px 0 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                  <td style="width:150px;vertical-align:middle;text-align:right;padding-right:12px;">
                    <img src="${this.baseImageUrl}/logo_white.png" alt="Vite &amp; Gourmand" width="110" height="110" style="display:block;margin-left:auto;">
                  </td>
                  <td style="vertical-align:middle;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;letter-spacing:-0.5px;text-shadow:0 2px 6px rgba(0,0,0,0.7),0 0 20px rgba(0,0,0,0.4);">Vite &amp; Gourmand</h1>
                    <p style="margin:8px 0 0;color:#fbbf24;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-shadow:0 2px 6px rgba(0,0,0,0.7),0 0 16px rgba(0,0,0,0.4);">Traiteur d'exception</p>
                  </td>
                  <td style="width:150px;"></td>
                </tr></table>
              </div>
              <!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-left:1px solid #ebe0cc;border-right:1px solid #ebe0cc;">
              ${content}
            </td>
          </tr>
          <!-- Footer with kitchen photo -->
          <tr>
            <td style="border-radius:0 0 12px 12px;padding:0;overflow:hidden;background-image:url('${this.baseImageUrl}/cta-bg.jpg');background-size:cover;background-position:center center;">
              <!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;"><v:fill type="frame" src="${this.baseImageUrl}/cta-bg.jpg" /><v:textbox inset="0,0,0,0"><![endif]-->
              <div style="background:linear-gradient(to bottom, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.88) 100%);padding:28px 40px;border-radius:0 0 12px 12px;text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px;"><tr>
                  <td style="vertical-align:middle;padding-right:8px;"><img src="${this.baseImageUrl}/logo_gold.png" alt="Logo" width="28" height="28" style="display:block;"></td>
                  <td style="vertical-align:middle;"><span style="color:#fbbf24;font-family:'Playfair Display',Georgia,serif;font-size:14px;font-weight:600;text-shadow:0 1px 4px rgba(0,0,0,0.5);">Vite &amp; Gourmand</span></td>
                </tr></table>
                <p style="margin:0;color:#cbd5e1;font-size:12px;line-height:1.5;text-shadow:0 1px 3px rgba(0,0,0,0.4);">
                  12 Rue Sainte-Catherine, 33000 Bordeaux<br>
                  <a href="${this.frontendUrl}" style="color:#fbbf24;text-decoration:none;">${this.frontendUrl.replace('https://', '')}</a>
                </p>
                <p style="margin:16px 0 0;color:#94a3b8;font-size:11px;text-shadow:0 1px 3px rgba(0,0,0,0.4);">
                  Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                </p>
              </div>
              <!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private button(text: string, url: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
  <tr>
    <td style="background-color:#d97706;border-radius:8px;">
      <a href="${url}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">${text}</a>
    </td>
  </tr>
</table>`;
  }

  private greeting(prenom: string): string {
    return `<p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">Bonjour <strong>${prenom}</strong>,</p>`;
  }

  private signature(): string {
    return `<p style="margin:24px 0 0;color:#64748b;font-size:14px;font-style:italic;">L'équipe Vite &amp; Gourmand</p>`;
  }

  private infoBox(content: string, color = '#d97706'): string {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
  <tr>
    <td style="background-color:#fffbeb;border-left:4px solid ${color};border-radius:0 8px 8px 0;padding:16px 20px;">
      ${content}
    </td>
  </tr>
</table>`;
  }

  private warningBox(content: string): string {
    return this.infoBox(content, '#dc2626');
  }

  async sendWelcomeEmail(to: string, prenom: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: 'Bienvenue chez Vite & Gourmand !',
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#d97706;font-size:22px;font-weight:700;">Bienvenue parmi nous !</h2>
          ${this.greeting(prenom)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Merci de vous être inscrit(e) chez <strong>Vite &amp; Gourmand</strong>. Nous sommes ravis de vous compter parmi nos clients.
          </p>
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Vous pouvez dès maintenant parcourir nos menus et passer votre première commande pour une prestation traiteur d'exception.
          </p>
          ${this.button('Découvrir nos menus', `${this.frontendUrl}/menus`)}
          ${this.signature()}
        `),
      });
      this.logger.log(`Email de bienvenue envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email bienvenue à ${to}`, error);
    }
  }

  async sendResetPasswordEmail(
    to: string,
    prenom: string,
    resetToken: string,
  ): Promise<void> {
    const resetLink = `${this.frontendUrl}/reset-password/${resetToken}`;

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: 'Réinitialisation de votre mot de passe — Vite & Gourmand',
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#d97706;font-size:22px;font-weight:700;">Réinitialisation de mot de passe</h2>
          ${this.greeting(prenom)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en définir un nouveau :
          </p>
          ${this.button('Réinitialiser mon mot de passe', resetLink)}
          ${this.infoBox(`
            <p style="margin:0;color:#92400e;font-size:13px;line-height:1.5;">
              <strong>Ce lien est valable pendant 1 heure.</strong><br>
              Si vous n'avez pas fait cette demande, ignorez simplement cet email.
            </p>
          `)}
          ${this.signature()}
        `),
      });
      this.logger.log(`Email reset password envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email reset à ${to}`, error);
    }
  }

  async sendOrderConfirmationEmail(
    to: string,
    prenom: string,
    numeroCommande: string,
    prixTotal: number,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: `Confirmation de commande ${numeroCommande} — Vite & Gourmand`,
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#059669;font-size:22px;font-weight:700;">Commande confirmée !</h2>
          ${this.greeting(prenom)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Votre commande a bien été enregistrée. Voici le récapitulatif :
          </p>
          ${this.infoBox(`
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#92400e;font-size:14px;padding:4px 0;"><strong>N° de commande</strong></td>
                <td style="color:#92400e;font-size:14px;padding:4px 0;text-align:right;font-weight:700;">${numeroCommande}</td>
              </tr>
              <tr>
                <td style="color:#92400e;font-size:14px;padding:4px 0;"><strong>Montant total</strong></td>
                <td style="color:#92400e;font-size:14px;padding:4px 0;text-align:right;font-weight:700;">${prixTotal.toFixed(2)} €</td>
              </tr>
            </table>
          `)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Vous pouvez suivre l'avancement de votre commande depuis votre espace client.
          </p>
          ${this.button('Suivre ma commande', `${this.frontendUrl}/dashboard`)}
          ${this.signature()}
        `),
      });
      this.logger.log(`Email confirmation commande envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email confirmation à ${to}`, error);
    }
  }

  async sendMaterielReturnEmail(
    to: string,
    prenom: string,
    numeroCommande: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: `Retour du matériel — Commande ${numeroCommande}`,
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#d97706;font-size:22px;font-weight:700;">Retour du matériel</h2>
          ${this.greeting(prenom)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Votre prestation <strong>${numeroCommande}</strong> est terminée. Nous espérons que tout s'est bien passé !
          </p>
          ${this.warningBox(`
            <p style="margin:0;color:#991b1b;font-size:13px;line-height:1.5;">
              <strong>Rappel important :</strong> Le matériel doit être retourné dans un délai de <strong>10 jours ouvrés</strong>.<br>
              Passé ce délai, des frais de <strong>600 €</strong> seront appliqués.
            </p>
          `)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Pour toute question concernant le retour du matériel, n'hésitez pas à nous contacter.
          </p>
          ${this.button('Nous contacter', `${this.frontendUrl}/contact`)}
          ${this.signature()}
        `),
      });
      this.logger.log(`Email retour matériel envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email matériel à ${to}`, error);
    }
  }

  async sendOrderCompletedEmail(
    to: string,
    prenom: string,
    numeroCommande: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: `Commande ${numeroCommande} terminée — Donnez votre avis !`,
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#059669;font-size:22px;font-weight:700;">Commande terminée</h2>
          ${this.greeting(prenom)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Votre commande <strong>${numeroCommande}</strong> est terminée. Nous espérons que vous avez apprécié notre service !
          </p>
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Votre avis compte beaucoup pour nous. N'hésitez pas à nous faire part de votre expérience :
          </p>
          ${this.button('Donner mon avis', `${this.frontendUrl}/dashboard`)}
          ${this.signature()}
        `),
      });
      this.logger.log(`Email commande terminée envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email terminée à ${to}`, error);
    }
  }

  async sendEmployeeCreatedEmail(to: string, prenom: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: 'Votre compte employé — Vite & Gourmand',
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#d97706;font-size:22px;font-weight:700;">Bienvenue dans l'équipe !</h2>
          ${this.greeting(prenom)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Un compte employé a été créé pour vous chez <strong>Vite &amp; Gourmand</strong>.
          </p>
          ${this.infoBox(`
            <p style="margin:0;color:#92400e;font-size:13px;line-height:1.5;">
              Connectez-vous avec votre adresse email.<br>
              <strong>Votre mot de passe vous a été communiqué séparément.</strong>
            </p>
          `)}
          ${this.button('Se connecter', `${this.frontendUrl}/connexion`)}
          ${this.signature()}
        `),
      });
      this.logger.log(`Email création employé envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email employé à ${to}`, error);
    }
  }

  async sendContactEmail(
    sujet: string,
    message: string,
    emailExpediteur: string,
    nom?: string,
  ): Promise<void> {
    const contactEmail = this.configService.get<string>(
      'CONTACT_EMAIL',
      'contact@viteetgourmand.fr',
    );

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: contactEmail,
        replyTo: emailExpediteur,
        subject: `[Contact] ${sujet}`,
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#d97706;font-size:22px;font-weight:700;">Nouveau message de contact</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #ebe0cc;">
                <span style="color:#64748b;font-size:13px;">Expéditeur</span><br>
                <strong style="color:#334155;font-size:15px;">${nom ? `${nom} (${emailExpediteur})` : emailExpediteur}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #ebe0cc;">
                <span style="color:#64748b;font-size:13px;">Sujet</span><br>
                <strong style="color:#334155;font-size:15px;">${sujet}</strong>
              </td>
            </tr>
          </table>
          ${this.infoBox(`
            <p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
          `)}
        `),
      });
      this.logger.log(`Email de contact transféré depuis ${emailExpediteur}`);
    } catch (error) {
      this.logger.error(`Échec envoi email contact depuis ${emailExpediteur}`, error);
    }
  }

  async sendOrderCancelledEmail(
    to: string,
    prenom: string,
    numeroCommande: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: `Annulation de votre commande ${numeroCommande} — Vite & Gourmand`,
        html: this.layout(`
          <h2 style="margin:0 0 24px;color:#dc2626;font-size:22px;font-weight:700;">Commande annulée</h2>
          ${this.greeting(prenom)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Votre commande <strong>${numeroCommande}</strong> a bien été annulée.
          </p>
          ${this.infoBox(`
            <p style="margin:0;color:#92400e;font-size:13px;line-height:1.5;">
              Si cette annulation n'est pas de votre fait ou si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
          `)}
          <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">
            Nous espérons vous retrouver très bientôt pour une prochaine prestation !
          </p>
          ${this.button('Voir nos menus', `${this.frontendUrl}/menus`)}
          ${this.signature()}
        `),
      });
      this.logger.log(`Email annulation commande envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email annulation à ${to}`, error);
    }
  }
}
