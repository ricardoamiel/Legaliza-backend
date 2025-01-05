import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AperturaLibroDocument = HydratedDocument<AperturaLibro>;

@Schema({
  timestamps: true,
  collection: 'apertura_libros',
})
export class AperturaLibro {
  @Prop({ required: true })
  tipoDocumento: string;

  @Prop({ required: true })
  numeroDocumento: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  celular: number;

  @Prop()
  idADocumentoIdentidadAnverso?: string;

  @Prop()
  idDocumentoIdentidadReverso?: string;

  @Prop({ required: true })
  numeroLibro: string;

  @Prop({ required: true })
  tipoLibro: string;

  @Prop({ required: true })
  tipoLegalizacion: string;

  @Prop({ required: true })
  numeroFojas: string;

  @Prop({ required: true })
  tipoFojas: string;

  @Prop()
  detallesObservaciones?: string;

  @Prop({ required: true })
  idUsuario: string;

  @Prop()
  numeroProceso: number;
}

export const AperturaLibroSchema = SchemaFactory.createForClass(AperturaLibro);
