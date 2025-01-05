import { IsOptional, IsString } from 'class-validator';

export class CreateDatoClienteDto {
  @IsString()
  tipoCondicion: string;

  @IsString()
  tipoDocumento: string;

  @IsString()
  numeroDocumento: string;

  @IsString()
  apellidoPaterno: string;

  @IsString()
  apellidoMaterno: string;

  @IsString()
  nombres: string;

  @IsString()
  estadoCivil: string;

  @IsString()
  direccion: string;

  @IsString()
  @IsOptional()
  nacionalidad: string;

  @IsString()
  @IsOptional()
  idADocumentoIdentidadAnverso: string;

  @IsString()
  @IsOptional()
  idDocumentoIdentidadReverso: string;
}
