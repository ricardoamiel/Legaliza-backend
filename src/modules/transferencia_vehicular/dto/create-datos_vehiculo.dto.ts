// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/create-datos_vehiculo.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateDatosVehiculoDto {
  @IsString()
  placa: string;

  @IsString()
  oficinaRegistral: string;

  @IsString()
  tipoMonedaOperacion: string;

  @IsString()
  precioVenta: string;

  @IsString()
  @IsOptional()
  soatVigente?: string;

  @IsString()
  @IsOptional()
  tarjetaPropiedad?: string;

  @IsString()
  medioPago: string;
}