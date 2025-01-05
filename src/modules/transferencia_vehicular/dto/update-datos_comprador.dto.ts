// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/update-datos_comprador.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDatosCompradorDto } from './create-datos_comprador.dto';

export class UpdateDatosCompradorDto extends PartialType(CreateDatosCompradorDto) {}