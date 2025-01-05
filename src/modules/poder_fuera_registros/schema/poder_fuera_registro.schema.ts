import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DatoCliente } from '../interface/dato_cliente.interface';

export type PoderFueraRegistroDocument = HydratedDocument<PoderFueraRegistro>;

@Schema({
  timestamps: true,
  collection: 'poder_fuera_registros',
})
export class PoderFueraRegistro {
  @Prop({ required: true })
  idUsuario: string;

  @Prop({ required: true })
  tipoPoder: string;

  @Prop({ required: true })
  datoClientes: DatoCliente[];

  @Prop()
  plazoPoder: string;

  @Prop()
  facultadesOtorgar: string;

  @Prop({ required: true })
  opcionTomaDomicilio: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: true })
  horaTomaDomicilio: string;

  @Prop()
  numeroProceso: number;
}

export const PoderFueraRegistroSchema =
  SchemaFactory.createForClass(PoderFueraRegistro);