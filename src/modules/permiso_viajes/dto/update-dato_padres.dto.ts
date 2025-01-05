import { PartialType } from '@nestjs/swagger';
import { CreateDataPadresDto } from './create-data_padres.dto';

export class UpdateDataPadreDto extends PartialType(CreateDataPadresDto) {}
