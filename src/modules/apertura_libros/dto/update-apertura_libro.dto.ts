import { PartialType } from '@nestjs/mapped-types';
import { CreateAperturaLibroDto } from './create-apertura_libro.dto';

export class UpdateAperturaLibroDto extends PartialType(
  CreateAperturaLibroDto,
) {}
