import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateDataEntregaDto {
    @IsString()
    lugarEntrega: string;
    
    @IsString()
    provincia: string;

    @IsString()
    departamento: string;

    @IsString()
    distrito: string;

    @IsOptional()
    @IsString()
    notaria?: string;

    @IsOptional()
    @IsString()
    direccion?: string;
}