import { IsBoolean, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateDataEnviadorDto {
    @IsString()
    nombre: string;
    
    @IsString()
    correo: string;

    @IsString()
    celular: string;

    @IsBoolean()
    cartaPuerta: boolean;

    @IsBoolean()
    servicioExpress: boolean;

    @IsOptional()
    @IsString()
    observaciones?: string;
}