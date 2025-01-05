import { IsString, ValidateIf } from 'class-validator';

export class CreateDataContratanteDto {
    @IsString()
    tipoCondicion: string;
  
    @IsString()
    tipoDocumento: string;
  
    @IsString()
    numeroDocumento: string;
  
    @IsString()
    apellidoPaterno: string;
  
    @IsString()
    apellidoMaterno: string;
  
    @IsString()
    nombres: string;
  
    @IsString()
    estadoCivil: string;
  
    @IsString()
    ocupacion: string;
  
    @IsString()
    correo: string;
  
    @IsString()
    direccion: string;
  
    @ValidateIf((obj) => obj.tipoDocumento === 'CE') 
    @IsString({ message: 'La nacionalidad es obligatoria cuando el tipo de documento es CE.' })
    nacionalidad: string;
}