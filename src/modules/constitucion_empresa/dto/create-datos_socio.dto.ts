import { IsString } from 'class-validator';

export class CreateDatosSocioDto {
    @IsString()
    nombresSocio: string;

    @IsString()
    apellidosSocio: string;

    @IsString()
    correoSocio: string;

    @IsString()
    cargoSocio: string;
}