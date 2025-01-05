import { PartialType } from '@nestjs/swagger';
import { CreateDataContratanteDto } from './create-datos_contratante.dto';

export class UpdateDataContratanteDto extends PartialType(CreateDataContratanteDto) {}
