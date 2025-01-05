import { PartialType } from '@nestjs/swagger';
import { CreateDataEnviadorDto } from './create-datos_enviador.dto';

export class UpdateDataEnviadorDto extends PartialType(CreateDataEnviadorDto) {}