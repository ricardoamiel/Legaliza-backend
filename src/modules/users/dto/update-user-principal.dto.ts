import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserPrincipalDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  tipoUsuario?: string;
  
  @IsOptional()
  @IsString()
  fotoPerfil?: string;
}