import { PartialType } from '@nestjs/swagger';
import { CreateDatosConstitucionEmpresaDto } from './create-datos_constitucion_empresa.dto';

export class UpdateDatosConstitucionEmpresaDto extends PartialType(CreateDatosConstitucionEmpresaDto) {}