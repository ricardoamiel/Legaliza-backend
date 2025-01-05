import { PartialType } from '@nestjs/swagger';
import { CreateProvincianDto } from './create-provincia.dto';

export class UpdateProvinciaDto extends PartialType(CreateProvincianDto) {}
