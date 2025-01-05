import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateDataContratanteDto } from './create-datos_contratante.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateAsuntosNoContenciososDto {
  @IsString()
  tipoActo: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDataContratanteDto)
  dataContratantes: CreateDataContratanteDto[];

  @IsString()
  motivo: string;

  @IsOptional()
  @IsString()
  //partidaDefuncion: string;
  file1: string;

  @IsOptional()
  @IsString()
  //partidaNacimientoHerederos: string; 
  file2: string;

  @IsOptional()
  @IsString()
  file3: string;

  @IsOptional()
  @IsString()
  file4: string;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  usuario: CreateUserDto;
}
