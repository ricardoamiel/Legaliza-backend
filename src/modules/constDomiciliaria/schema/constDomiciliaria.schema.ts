import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type constDomiciliariaDocument = HydratedDocument<constDomiciliaria>;

@Schema({
  timestamps: true,
  collection: 'constatacion_domiciliaria',
})
export class constDomiciliaria {
  @Prop({ required: true })
  tipoCliente: string;

  @Prop()
  numeroProceso: number;

  @Prop({ required: true })
  tipoDocumento: string;

  @Prop({ required: true })
  numeroDocumento: string;

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true })
  apellidoPaterno: string;

  @Prop({ required: true })
  apellidoMaterno: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  direccion: string;

  @Prop()
  nacionalidad?: string;

  @Prop()
  documentoCopiaLiteral?: string;

  @Prop({ required: true })
  departamentoArchivo: string;

  @Prop({ required: true })
  provinciaArchivo: string;

  @Prop({ required: true })
  distritoArchivo: string;

  @Prop({ required: true })
  direccionArchivo: string;

  @Prop({ required: true })
  observaciones: string;

  @Prop({ required: true })
  idUsuario: string;
}

export const constDomiciliariaSchema =
  SchemaFactory.createForClass(constDomiciliaria);