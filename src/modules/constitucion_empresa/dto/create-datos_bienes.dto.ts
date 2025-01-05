import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateDatosBienes {
    @IsNumber()
    cantidad: number;

    @IsString()
    descripcion: string;

    @IsNumber()
    valor: number;

    @IsBoolean()
    electronico: boolean;

    @IsString()
    @IsOptional()
    marcaModelo?: string;

    @IsString()
    @IsOptional()
    n_serie?: string;
}