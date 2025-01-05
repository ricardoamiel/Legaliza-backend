import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DataSolicitante } from '../interface/datos_solicitante.interface';

export type EscrituraPublicaDocument = HydratedDocument<EscrituraPublica>;

@Schema({
  timestamps: true,
  collection: 'escritura_publica',
})
export class EscrituraPublica {
  @Prop({ required: true })
  idUsuario: string;

  @Prop()
  numeroProceso: number;

  @Prop({ required: true })
  tipoTramite: string;

  @Prop({ required: true })
  dataSolicitantes: DataSolicitante[];

  @Prop({ required: true })
  observaciones: string;
}

export const EscrituraPublicaSchema =
  SchemaFactory.createForClass(EscrituraPublica);