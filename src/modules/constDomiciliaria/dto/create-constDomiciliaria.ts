import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateConstDomiciliariaDto{
    @IsString()
    tipoCliente: string;

    @IsString()
    tipoDocumento: string;
  
    @IsString()
    numeroDocumento: string;

    @IsString()
    nombres: string;

    @IsString()
    apellidoPaterno: string;

    @IsString()
    apellidoMaterno: string;

    @IsEmail()
    correo: string;

    @IsString()
    direccion: string;

    @IsString()
    @IsOptional()
    documentoCopiaLiteral?: string;

    @IsString()
    departamentoArchivo: string;

    @IsString()
    provinciaArchivo: string;

    @IsString()
    distritoArchivo: string;

    @IsString()
    direccionArchivo: string;

    @ValidateIf((obj) => obj.tipoDocumento === 'CE') 
    @IsString({ message: 'La nacionalidad es obligatoria cuando el tipo de documento es CE.' })
    nacionalidad: string;

    @IsString()
    observaciones: string;

    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    usuario: CreateUserDto;
}