export interface DatoCliente {
  tipoCondicion: string;

  tipoDocumento: string;

  numeroDocumento: string;

  apellidoPaterno: string;

  apellidoMaterno: string;

  nombres: string;

  estadoCivil: string;

  nacionalidad?: string;

  direccion: string;

  idADocumentoIdentidadAnverso?: string;

  idDocumentoIdentidadReverso?: string;
}
