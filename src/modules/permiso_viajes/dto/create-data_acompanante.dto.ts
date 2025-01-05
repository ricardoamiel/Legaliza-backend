import { IsString } from 'class-validator';

export class CreateDataAcompananteDto {
  @IsString()
  tipoDocumento: string;

  @IsString()
  numeroDocumento: string;

  @IsString()
  nombreCompleto: string;
}
