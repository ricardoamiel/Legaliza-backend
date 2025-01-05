// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/create-datos_comprador.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateDatosCompradorDto {
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
}