import { PartialType } from '@nestjs/swagger';
import { CreatePoderFueraRegistroDto } from './create-poder_fuera_registro.dto';

export class UpdatePoderFueraRegistroDto extends PartialType(CreatePoderFueraRegistroDto) {}
