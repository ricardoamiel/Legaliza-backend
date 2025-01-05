import { IsOptional, IsString } from 'class-validator';

export class CreateTramiteDto {
  @IsString()
  idUsuario: string;
  @IsString()
  tipoTramite: string;

  @IsString()
  idTipoTramite: string;
  @IsString()
  numeroProceso: number;
  @IsString()
  @IsOptional()
  estado?: string;
}
