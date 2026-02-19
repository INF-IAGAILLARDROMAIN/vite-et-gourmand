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

  async sendWelcomeEmail(to: string, prenom: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: 'Bienvenue chez Vite & Gourmand !',
        html: `
          <h1>Bienvenue ${prenom} !</h1>
          <p>Merci de vous être inscrit(e) chez <strong>Vite & Gourmand</strong>.</p>
          <p>Vous pouvez dès maintenant parcourir nos menus et passer commande.</p>
          <p>À très bientôt !</p>
          <p><em>L'équipe Vite & Gourmand</em></p>
        `,
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
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3001',
    );
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: 'Réinitialisation de votre mot de passe — Vite & Gourmand',
        html: `
          <h1>Réinitialisation de mot de passe</h1>
          <p>Bonjour ${prenom},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>Ce lien est valable pendant 1 heure.</p>
          <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
          <p><em>L'équipe Vite & Gourmand</em></p>
        `,
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
        html: `
          <h1>Commande confirmée !</h1>
          <p>Bonjour ${prenom},</p>
          <p>Votre commande <strong>${numeroCommande}</strong> a bien été enregistrée.</p>
          <p>Montant total : <strong>${prixTotal.toFixed(2)} €</strong></p>
          <p>Vous pouvez suivre l'avancement de votre commande depuis votre espace client.</p>
          <p><em>L'équipe Vite & Gourmand</em></p>
        `,
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
        html: `
          <h1>Retour du matériel</h1>
          <p>Bonjour ${prenom},</p>
          <p>Votre prestation <strong>${numeroCommande}</strong> est terminée.</p>
          <p>Nous vous rappelons que le matériel doit être retourné dans un délai de <strong>10 jours ouvrés</strong>.</p>
          <p>Passé ce délai, des frais de <strong>600 €</strong> seront appliqués.</p>
          <p><em>L'équipe Vite & Gourmand</em></p>
        `,
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
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3001',
    );

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: `Commande ${numeroCommande} terminée — Donnez votre avis !`,
        html: `
          <h1>Commande terminée</h1>
          <p>Bonjour ${prenom},</p>
          <p>Votre commande <strong>${numeroCommande}</strong> est terminée.</p>
          <p>Nous espérons que vous avez apprécié notre service !</p>
          <p><a href="${frontendUrl}/dashboard">Donnez votre avis</a> pour nous aider à nous améliorer.</p>
          <p><em>L'équipe Vite & Gourmand</em></p>
        `,
      });
      this.logger.log(`Email commande terminée envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email terminée à ${to}`, error);
    }
  }

  async sendEmployeeCreatedEmail(to: string, prenom: string): Promise<void> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3001',
    );

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject: 'Votre compte employé — Vite & Gourmand',
        html: `
          <h1>Bienvenue dans l'équipe !</h1>
          <p>Bonjour ${prenom},</p>
          <p>Un compte employé a été créé pour vous chez <strong>Vite & Gourmand</strong>.</p>
          <p>Connectez-vous sur <a href="${frontendUrl}/login">${frontendUrl}/login</a> avec votre email.</p>
          <p>Votre mot de passe vous a été communiqué séparément.</p>
          <p><em>L'équipe Vite & Gourmand</em></p>
        `,
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
        html: `
          <h1>Nouveau message de contact</h1>
          <p><strong>De :</strong> ${nom ? `${nom} (${emailExpediteur})` : emailExpediteur}</p>
          <p><strong>Sujet :</strong> ${sujet}</p>
          <hr>
          <p>${message}</p>
        `,
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
        html: `
          <h1>Commande annulée</h1>
          <p>Bonjour ${prenom},</p>
          <p>Votre commande <strong>${numeroCommande}</strong> a bien été annulée.</p>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>À bientôt !</p>
          <p><em>L'équipe Vite & Gourmand</em></p>
        `,
      });
      this.logger.log(`Email annulation commande envoyé à ${to}`);
    } catch (error) {
      this.logger.error(`Échec envoi email annulation à ${to}`, error);
    }
  }
}
