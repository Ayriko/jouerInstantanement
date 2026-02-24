import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: "Adresse email de l'utilisateur",
        example: 'john.doe@example.com',
        format: 'email',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        description:
            'Mot de passe (min 8 caractères, doit contenir au moins une majuscule, une minuscule et un chiffre)',
        example: 'SecurePass123!',
        minLength: 8,
        maxLength: 64,
        format: 'password',
    })
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    /*
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  })
   */
    password!: string;
}
