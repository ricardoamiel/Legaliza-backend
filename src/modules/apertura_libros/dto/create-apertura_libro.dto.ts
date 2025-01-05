import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateAperturaLibroDto {
  @IsString()
  tipoDocumento: string;

  @IsString()
  numeroDocumento: string;

  @IsEmail()
  correo: string;

  @IsNumber()
  celular: string;

  @IsString()
  @IsOptional()
  idADocumentoIdentidadAnverso?: string;

  @IsString()
  @IsOptional()
  idDocumentoIdentidadReverso?: string;

  @IsString()
  numeroLibro: string;

  @IsString()
  tipoLibro: string;

  @IsString()
  tipoLegalizacion: string;

  @IsString()
  numeroFojas: string;

  @IsString()
  tipoFojas: string;

  @IsString()
  @IsOptional()
  detallesObservaciones?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  usuario: CreateUserDto;
}
