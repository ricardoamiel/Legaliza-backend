// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/interface/datos_vehiculo.interface.ts
export interface DatosVehiculo {
    placa: string;
    oficinaRegistral: string;
    tipoMonedaOperacion: string;
    precioVenta: string;
    soatVigente?: string;
    tarjetaPropiedad?: string;
    medioPago: string;
  }