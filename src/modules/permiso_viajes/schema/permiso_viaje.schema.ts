import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DataPadre } from '../interface/datos_padre.interface';
import { DataMenor } from '../interface/datos_menor.interface';
import { DataAcompanante } from '../interface/datos_acompanante.interface';

export type PermisoViajeDocument = HydratedDocument<PermisoViaje>;

@Schema({
  timestamps: true,
  collection: 'permiso_viajes',
})
export class PermisoViaje {
  @Prop({ required: true })
  idUsuario: string;

  @Prop({ required: true })
  tipoPermisoViaje: string;

  @Prop({ required: true })
  datoPadres: DataPadre[];

  @Prop({ required: true })
  datoMenores: DataMenor[];

  @Prop({ required: true })
  destinoSale: string;

  @Prop({ required: true })
  destinoViaje: string;

  @Prop({ required: true })
  isRetorna: boolean;

  @Prop({ required: true })
  fechaSalida: Date;

  @Prop({ required: true })
  fechaRetorno: Date;

  @Prop({ required: true })
  medioTransporte: string;

  @Prop({ required: true })
  isViajeSolo: boolean;

  @Prop()
  datoAcompanantes: DataAcompanante[];

  @Prop()
  detalleObservacion: string;

  @Prop()
  numeroProceso: number;
}

export const PermisoViajeSchema = SchemaFactory.createForClass(PermisoViaje);