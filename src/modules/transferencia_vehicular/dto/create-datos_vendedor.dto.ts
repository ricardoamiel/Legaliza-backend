// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/create-datos_vendedor.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateDatosVendedorDto {
  @IsString()
  tipoDocumento: string;

  @IsString()
  nroDocumento: string;

  @IsString()
  ocupacion: string;

  @IsString()
  correo: string;

  @IsString()
  celular: string;

  @IsString()
  estadoCivil: string;

  @IsString()
  @IsOptional()
  copiaLiteral?: string;

  @IsString()
  ruc: string;
}