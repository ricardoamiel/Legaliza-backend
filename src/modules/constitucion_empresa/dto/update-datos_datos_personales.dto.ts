import { PartialType } from '@nestjs/swagger';
import { CreateDatosPersonalesDto } from './create-datos_datos_personales.dto';

export class UpdateDatosPersonalesDto extends PartialType(CreateDatosPersonalesDto) {}