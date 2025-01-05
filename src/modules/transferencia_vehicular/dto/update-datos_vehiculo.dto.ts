// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/update-datos_vehiculo.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDatosVehiculoDto } from './create-datos_vehiculo.dto';

export class UpdateDatosVehiculoDto extends PartialType(CreateDatosVehiculoDto) {}