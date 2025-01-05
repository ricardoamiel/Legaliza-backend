import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserPrincipalDto {
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  tipoUsuario: string;
  
  @IsOptional()
  @IsString()
  fotoPerfil: string;
}
