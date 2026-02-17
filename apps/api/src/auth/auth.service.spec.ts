import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

// Mock bcrypt at the module level
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock uuid (ESM-only package that Jest cannot parse without transformation)
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-token'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let mailService: MailService;

  const mockPrismaService = {
    utilisateur: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockMailService = {
    sendWelcomeEmail: jest.fn(),
    sendResetPasswordEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // ─── Register ────────────────────────────────────────────────────────

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password1!',
      nom: 'Dupont',
      prenom: 'Jean',
      telephone: '0612345678',
      adressePostale: '1 rue de la Paix, 75001 Paris',
    };

    it('should register a new user successfully', async () => {
      const mockRole = { id: 1, libelle: 'utilisateur' };
      const mockUser = {
        id: 1,
        email: registerDto.email,
        nom: registerDto.nom,
        prenom: registerDto.prenom,
        telephone: registerDto.telephone,
        adressePostale: registerDto.adressePostale,
        password: 'hashed-password',
        roleId: 1,
        role: mockRole,
      };

      mockPrismaService.utilisateur.findUnique.mockResolvedValue(null);
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrismaService.utilisateur.create.mockResolvedValue(mockUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        message: 'Inscription réussie',
        user: {
          id: 1,
          email: registerDto.email,
          nom: registerDto.nom,
          prenom: registerDto.prenom,
          role: 'utilisateur',
        },
        accessToken: 'mock-jwt-token',
      });

      expect(mockPrismaService.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockPrismaService.utilisateur.create).toHaveBeenCalled();
      expect(mockMailService.sendWelcomeEmail).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.prenom,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: registerDto.email,
        role: 'utilisateur',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 99,
        email: registerDto.email,
        nom: 'Existing',
        prenom: 'User',
      };

      mockPrismaService.utilisateur.findUnique.mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(authService.register(registerDto)).rejects.toThrow(
        'Un compte avec cet email existe déjà',
      );

      expect(mockPrismaService.utilisateur.create).not.toHaveBeenCalled();
    });
  });

  // ─── Login ───────────────────────────────────────────────────────────

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password1!',
    };

    const mockUser = {
      id: 1,
      email: loginDto.email,
      nom: 'Dupont',
      prenom: 'Jean',
      password: 'hashed-password',
      isActive: true,
      role: { id: 1, libelle: 'utilisateur' },
    };

    it('should login successfully with correct credentials', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        message: 'Connexion réussie',
        user: {
          id: 1,
          email: loginDto.email,
          nom: 'Dupont',
          prenom: 'Jean',
          role: 'utilisateur',
        },
        accessToken: 'mock-jwt-token',
      });

      expect(mockPrismaService.utilisateur.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        include: { role: true },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        'hashed-password',
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: loginDto.email,
        role: 'utilisateur',
      });
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.login(loginDto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );
    });

    it('should throw UnauthorizedException for non-existent email', async () => {
      mockPrismaService.utilisateur.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.login(loginDto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});
