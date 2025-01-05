import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateDatoClienteDto } from './create-dato_cliente.dto';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreatePoderFueraRegistroDto {
  @IsString()
  tipoPoder: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDatoClienteDto)
  datoClientes: CreateDatoClienteDto[];

  @IsString()
  @IsOptional()
  plazoPoder: string;

  @IsString()
  @IsOptional()
  facultadesOtorgar: string;

  @IsString()
  opcionTomaDomicilio: string;

  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsString()
  horaTomaDomicilio: string;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  usuario: CreateUserDto;
}
