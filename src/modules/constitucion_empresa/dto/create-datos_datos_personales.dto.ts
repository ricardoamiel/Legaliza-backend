import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDatosPersonalesDto {
    @IsString()
    nombres: string;

    @IsString()
    apellidos: string;

    @IsString()
    tipoDocumento: string;

    @IsString()
    numeroDocumento: string;

    @IsString()
    profesion: string;

    @IsString()
    nacionalidad: string;

    @IsString()
    numeroContacto: string;

    @IsString()
    departamento: string;

    @IsString()
    provincia: string;

    @IsString()
    distrito: string;

    @IsString()
    direccion: string;

    @IsString()
    estadoCivil: string; 

    @IsBoolean()
    @IsOptional()
    bienesSeparados: boolean;

    @IsString()
    @IsOptional()
    NombresConyuge?: string;

    @IsString()
    @IsOptional()
    ApellidosConyuge?: string;

    @IsString()
    @IsOptional()
    tipoDocumentoConyuge?: string;

    @IsString()
    @IsOptional()
    numeroDocumentoConyuge?: string;

    @IsString()
    @IsOptional()
    numeroPartidaRegistral?: string;

    @IsString()
    @IsOptional()
    oficinaRegistral?: string;
}