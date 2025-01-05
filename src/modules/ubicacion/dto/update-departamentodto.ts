import { PartialType } from '@nestjs/swagger';
import { CreateUDepartamentoDto } from './create-departamento.dto';

export class UpdateDepartamentoDto extends PartialType(
  CreateUDepartamentoDto,
) {}
