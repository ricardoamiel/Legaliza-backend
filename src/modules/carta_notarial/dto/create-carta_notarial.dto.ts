import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateDataDestinarioDto } from './create-datos_destinario.dto';
import { CreateDataEntregaDto } from './create-datos_entrega.dto';
import { CreateDataEnviadorDto } from './create-datos_enviador.dto';
import { CreateDataRemitenteDto } from './create-datos_remitente.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateCartaNotarialDto {
  @ValidateNested({ each: true })
  @Type(() => CreateDataRemitenteDto)
  datoRemitentes: CreateDataRemitenteDto;

  @ValidateNested({ each: true })
  @Type(() => CreateDataDestinarioDto)
  datoDestinatarios: CreateDataDestinarioDto;

  @ValidateNested({ each: true })
  @Type(() => CreateDataEntregaDto)
  datoEntregaCarta: CreateDataEntregaDto;

  @ValidateNested({ each: true })
  @Type(() => CreateDataEnviadorDto)
  datoEnviador: CreateDataEnviadorDto;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  usuario: CreateUserDto;
}
