import { PartialType } from '@nestjs/swagger';
import { CreateAsuntosNoContenciososDto } from './create-asuntos_no_contenciosos.dto';

export class UpdateAsuntosNoContenciososDto extends PartialType(CreateAsuntosNoContenciososDto) {}