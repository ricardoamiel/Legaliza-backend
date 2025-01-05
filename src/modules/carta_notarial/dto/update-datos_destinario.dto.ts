import { PartialType } from '@nestjs/swagger';
import { CreateDataDestinarioDto } from './create-datos_destinario.dto';

export class UpdateDataDestinarioDto extends PartialType(CreateDataDestinarioDto) {}