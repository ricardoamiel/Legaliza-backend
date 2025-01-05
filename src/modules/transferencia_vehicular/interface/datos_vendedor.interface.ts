// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/interface/datos_vendedor.interface.ts
export interface DatosVendedor {
    tipoDocumento: string;
    nroDocumento: string;
    ocupacion: string;
    correo: string;
    celular: string;
    estadoCivil: string;
    copiaLiteral?: string;
    ruc: string;
  }