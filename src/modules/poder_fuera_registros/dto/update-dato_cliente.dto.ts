import { PartialType } from '@nestjs/swagger';
import { CreateDatoClienteDto } from './create-dato_cliente.dto';

export class UpdateCreateDatoClienteDtoDto extends PartialType(
  CreateDatoClienteDto,
) {}
