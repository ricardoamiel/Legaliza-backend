import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateDataDestinarioDto {
    @IsString()
    tipoDocumento: string;

    @IsString()
    numeroDocumento: string;
    
    @IsString()
    nombre: string;
    
    @IsString()
    direccion: string;

    @IsOptional()
    @IsString()
    nacionalidad?: string;
}