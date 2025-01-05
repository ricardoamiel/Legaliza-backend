// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/dto/update-datos_vendedor.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDatosVendedorDto } from './create-datos_vendedor.dto';

export class UpdateDatosVendedorDto extends PartialType(CreateDatosVendedorDto) {}