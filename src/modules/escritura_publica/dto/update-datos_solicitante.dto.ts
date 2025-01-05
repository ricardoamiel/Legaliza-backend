import { PartialType } from '@nestjs/swagger';
import { CreateDataSolicitanteDto } from './create-datos_solicitante.dto';

export class UpdateDataSolicitanteDto extends PartialType(CreateDataSolicitanteDto) {}
