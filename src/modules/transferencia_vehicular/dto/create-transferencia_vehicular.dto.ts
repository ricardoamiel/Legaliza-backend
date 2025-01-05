// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/create-transferencia_vehicular.dto.ts
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CreateDatosVehiculoDto } from './create-datos_vehiculo.dto';
import { CreateDatosVendedorDto } from './create-datos_vendedor.dto';
import { CreateDatosCompradorDto } from './create-datos_comprador.dto';

export class CreateTransferenciaVehicularDto {
  @IsString()
  tipoActo: string;
  
  @ValidateNested({ each: true })
  @Type(() => CreateDatosVehiculoDto)
  datosVehiculo: CreateDatosVehiculoDto;

  @ValidateNested({ each: true })
  @Type(() => CreateDatosVendedorDto)
  datosVendedor: CreateDatosVendedorDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateDatosCompradorDto)
  datosCompradores: CreateDatosCompradorDto[];
}