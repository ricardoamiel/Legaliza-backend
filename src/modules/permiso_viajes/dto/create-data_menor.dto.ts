import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDataMenorDto {
  @IsString()
  tipoDocumento: string;

  @IsString()
  numeroDocumento: string;

  @IsString()
  nombreCompleto: string;

  @IsInt()
  edad: number;

  @IsOptional()
  nacionalidad?: string;

  @IsOptional()
  idADocumentoIdentidadAnverso?: string;

  @IsOptional()
  idDocumentoIdentidadReverso?: string;
}
