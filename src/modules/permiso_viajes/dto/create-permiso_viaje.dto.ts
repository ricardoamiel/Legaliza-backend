import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateDataAcompananteDto } from './create-data_acompanante.dto';
import { CreateDataPadresDto } from './create-data_padres.dto';
import { CreateDataMenorDto } from './create-data_menor.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreatePermisoViajeDto {
  @IsString()
  tipoPermisoViaje: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDataPadresDto)
  datoPadres: CreateDataPadresDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateDataMenorDto)
  datoMenores: CreateDataMenorDto[];

  @IsString()
  destinoSale: string;

  @IsString()
  destinoViaje: string;

  @IsBoolean()
  isRetorna: boolean;

  @IsDate()
  @Type(() => Date)
  fechaSalida: Date;

  @IsDate()
  @Type(() => Date)
  fechaRetorno: Date;

  @IsString()
  medioTransporte: string;

  @IsBoolean()
  isViajeSolo: boolean;

  @ValidateIf((o) => !o.isViajeSolo)
  @IsDefined({
    message: 'Dato de acompañantes es requerido si no viajas solo.',
  })

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDataAcompananteDto)
  datoAcompanantes: CreateDataAcompananteDto[];

  @IsString()
  @IsOptional()
  detalleObservacion: string;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  usuario: CreateUserDto;
}
