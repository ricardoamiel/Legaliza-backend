import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DataContratante } from '../interface/datos_contratante.interface';

export type AsuntosNoContenciososDocument =
  HydratedDocument<AsuntosNoContenciosos>;

@Schema({
  timestamps: true,
  collection: 'asuntos_no_contenciosos',
})
export class AsuntosNoContenciosos {
  @Prop({ required: true })
  idUsuario: string;

  @Prop()
  numeroProceso: number;

  @Prop({ required: true })
  tipoActo: string;

  @Prop({ required: true })
  dataContratantes: DataContratante[];

  @Prop({ required: true })
  motivo: string;

  @Prop()
  file1: string;

  @Prop()
  file2: string;

  @Prop()
  file3: string;

  @Prop()
  file4: string;
}

export const AsuntosNoContenciososSchema = SchemaFactory.createForClass(
  AsuntosNoContenciosos,
);