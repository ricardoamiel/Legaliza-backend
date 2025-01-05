// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/schema/transferencia_vehicular.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { DatosVehiculo } from '../interface/datos_vehiculo.interface';
import { DatosVendedor } from '../interface/datos_vendedor.interface';
import { DatosComprador } from '../interface/datos_comprador.interface';

export type TransferenciaVehicularDocument = HydratedDocument<TransferenciaVehicular>;

@Schema({
  timestamps: true,
  collection: 'transferencia_vehicular',
})

export class TransferenciaVehicular extends Document {
  @Prop({ required: true })
  idUsuario: string;
  
  @Prop({ required: true })
  tipoActo: string;

  @Prop({ required: true })
  datosVehiculo: DatosVehiculo[];

  @Prop({ required: true })
  datosVendedor: DatosVendedor[];

  @Prop({ required: true })
  datosCompradores: DatosComprador[];

  @Prop({ required: true })
  numeroProceso: number;
}

export const TransferenciaVehicularSchema = SchemaFactory.createForClass(TransferenciaVehicular);