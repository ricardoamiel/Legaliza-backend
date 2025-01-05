import { PartialType } from '@nestjs/swagger';
import { CreateDatosBienes } from './create-datos_bienes.dto';
export class UpdateDatosBienes extends PartialType(CreateDatosBienes) {}