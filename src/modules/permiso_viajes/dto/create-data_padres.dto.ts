import { IsOptional, IsString } from 'class-validator';

export class CreateDataPadresDto {
  @IsString()
  tipoInterviniente: string;

  @IsString()
  tipoDocumento: string;

  @IsString()
  numeroDocumento: string;

  @IsString()
  email: string;

  @IsString()
  celular: string;

  @IsString()
  departamento: string;

  @IsString()
  provincia: string;

  @IsString()
  distrito: string;

  @IsOptional()
  oficinaRegistral?: string;

  @IsOptional()
  partidaRegistral?: string;

  @IsOptional()
  condicion?: string;

  @IsOptional()
  idADocumentoIdentidadAnverso?: string;

  @IsOptional()
  idDocumentoIdentidadReverso?: string;
}
