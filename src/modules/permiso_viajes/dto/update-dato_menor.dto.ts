import { PartialType } from '@nestjs/swagger';
import { CreateDataMenorDto } from './create-data_menor.dto';

export class UpdateDataMenorDto extends PartialType(CreateDataMenorDto) {}
