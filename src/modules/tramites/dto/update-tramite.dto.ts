import { PartialType } from '@nestjs/swagger';
import { CreateTramiteDto } from './create-tramite.dto';

export class UpdateTramiteDto extends PartialType(CreateTramiteDto) {}
