import { PartialType } from '@nestjs/swagger';
import { CreateDataEntregaDto } from './create-datos_entrega.dto';

export class UpdateDataEntregaDto extends PartialType(CreateDataEntregaDto) {}