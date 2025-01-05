import { PartialType } from '@nestjs/swagger';
import { CreateDatosSocioDto } from './create-datos_socio.dto';

export class UpdateDatosSocioDto extends PartialType(CreateDatosSocioDto) {}