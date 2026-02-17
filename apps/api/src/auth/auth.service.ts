import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  // In-memory store for reset tokens (maps token -> { userId, expiresAt })
  // In production, use Redis or a DB table
  private resetTokens = new Map<
    string,
    { userId: number; expiresAt: Date }
  >();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone,
      adressePostale: user.adressePostale,
      role: user.role.libelle,
      createdAt: user.createdAt,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Get or create default "utilisateur" role
    let role = await this.prisma.role.findUnique({
      where: { libelle: 'utilisateur' },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: { libelle: 'utilisateur' },
      });
    }

    const user = await this.prisma.utilisateur.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        nom: dto.nom,
        prenom: dto.prenom,
        telephone: dto.telephone,
        adressePostale: dto.adressePostale,
        roleId: role.id,
      },
      include: { role: true },
    });

    // Send welcome email (async, don't block response)
    this.mailService.sendWelcomeEmail(user.email, user.prenom);

    const tokens = this.generateTokens(user.id, user.email, user.role.libelle);

    return {
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role.libelle,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été désactivé');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role.libelle);

    return {
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role.libelle,
      },
      ...tokens,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      return {
        message:
          'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé',
      };
    }

    // Generate a unique reset token
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    this.resetTokens.set(resetToken, { userId: user.id, expiresAt });

    // Send reset email
    await this.mailService.sendResetPasswordEmail(
      user.email,
      user.prenom,
      resetToken,
    );

    return {
      message:
        'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenData = this.resetTokens.get(dto.token);

    if (!tokenData) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    if (new Date() > tokenData.expiresAt) {
      this.resetTokens.delete(dto.token);
      throw new BadRequestException('Token invalide ou expiré');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    await this.prisma.utilisateur.update({
      where: { id: tokenData.userId },
      data: { password: hashedPassword },
    });

    // Invalidate the token
    this.resetTokens.delete(dto.token);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  private generateTokens(userId: number, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
