// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/update-transferencia_vehicular.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferenciaVehicularDto } from './create-transferencia_vehicular.dto';

export class UpdateTransferenciaVehicularDto extends PartialType(CreateTransferenciaVehicularDto) {}