import { PartialType } from '@nestjs/swagger';
import { CreateDataRemitenteDto } from './create-datos_remitente.dto';

export class UpdateDataRemitenteDto extends PartialType(CreateDataRemitenteDto) {}