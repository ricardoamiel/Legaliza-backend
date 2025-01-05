import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateDataSolicitanteDto } from './create-datos_solicitante.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateEscrituraPublicaDto {  
    @IsString()
    tipoTramite: string;
  
    @ValidateNested({ each: true })
    @Type(() => CreateDataSolicitanteDto)
    dataSolicitantes: CreateDataSolicitanteDto[];
  
    @IsString()
    observaciones: string;

    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    usuario: CreateUserDto;
}

