import { PartialType } from '@nestjs/swagger';
import { CreateDataAcompananteDto } from './create-data_acompanante.dto';

export class UpdateDataAcompananteDto extends PartialType(
  CreateDataAcompananteDto,
) {}
