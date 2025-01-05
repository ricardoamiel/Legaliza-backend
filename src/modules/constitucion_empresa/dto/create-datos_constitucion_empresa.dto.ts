import { IsString, ValidateNested, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDatosSocioDto } from './create-datos_socio.dto';
import { CreateDatosPersonalesDto } from './create-datos_datos_personales.dto';
import { CreateDatosBienes } from './create-datos_bienes.dto';

export class CreateDatosConstitucionEmpresaDto {
  @IsString()
  tipoConstitucion: string;

  @IsArray()
  @IsString({ each: true })
  nombresEmpresa: string[];

  @IsString()
  tipoSociedad: string;

  @IsArray()
  @IsString({ each: true })
  actividadesEmpresa: string[];

  @IsString()
  @IsOptional()
  descripcionEmpresa?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDatosSocioDto)
  socios: CreateDatosSocioDto[];

  @IsNumber()
  capitalSocial: number;

  @IsString()
  tipoAportacion: string;

  @IsNumber()
  @IsOptional()
  cantidadEfectivo?: number;

  @IsNumber()
  @IsOptional()
  cantidadBienes?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateDatosPersonalesDto)
  representanteLegal: CreateDatosPersonalesDto[];

  @IsNumber()
  @IsOptional()
  aporteEfectivo: number;

  @IsNumber()
  @IsOptional()
  aporteBienes: number;

  @ValidateNested({ each: true })
  @Type(() => CreateDatosBienes)
  @IsOptional()
  Bienes: CreateDatosBienes[];

  @IsString()
  correoEmpresa: string;

  @IsString()
  telefonoEmpresa: string;

  @IsString()
  direccionEmpresa: string; 

  @IsString()
  tipoDomicilio: string;

  @IsString()
  tipoRegimen: string;
}