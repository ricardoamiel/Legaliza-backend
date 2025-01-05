export interface DatosPersonales {
    nombres: string;
    apellidos: string;
    tipoDocumento: string;
    numeroDocumento: string;
    profesion: string;
    nacionalidad: string;
    numeroContacto: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    estadoCivil: string;
    bienesSeparados?: boolean;
    NombresConyuge?: string;
    ApellidosConyuge?: string;
    tipoDocumentoConyuge?: string;
    numeroDocumentoConyuge?: string;
    numeroPartidaRegistral?: string;
    oficinaRegistral?: string;
}