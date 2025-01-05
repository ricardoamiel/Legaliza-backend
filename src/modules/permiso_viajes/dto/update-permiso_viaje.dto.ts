import { PartialType } from '@nestjs/swagger';
import { CreatePermisoViajeDto } from './create-permiso_viaje.dto';

export class UpdatePermisoViajeDto extends PartialType(CreatePermisoViajeDto) {}
