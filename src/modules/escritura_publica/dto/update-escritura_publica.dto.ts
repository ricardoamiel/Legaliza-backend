import { PartialType } from '@nestjs/swagger';
import { CreateEscrituraPublicaDto } from './create-escritura_publica.dto';

export class UpdateEscrituraPublicaDto extends PartialType(CreateEscrituraPublicaDto) {}