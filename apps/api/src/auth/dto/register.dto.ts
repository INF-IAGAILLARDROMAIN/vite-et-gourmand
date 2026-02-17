import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  nom: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  prenom: string;

  @IsString()
  @IsNotEmpty({ message: 'Le numéro de téléphone est requis' })
  telephone: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "L'adresse postale est requise" })
  adressePostale: string;

  @IsString()
  @MinLength(10, {
    message: 'Le mot de passe doit contenir au moins 10 caractères',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Le mot de passe doit contenir au moins une lettre minuscule',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Le mot de passe doit contenir au moins une lettre majuscule',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins un chiffre',
  })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message: 'Le mot de passe doit contenir au moins un caractère spécial',
  })
  password: string;
}
