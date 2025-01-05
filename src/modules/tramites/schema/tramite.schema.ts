import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TramiteDocument = HydratedDocument<Tramite>;

@Schema({
  timestamps: true,
  collection: 'tramites',
})
export class Tramite {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idUsuario: Types.ObjectId;

  @Prop()
  numeroTramite: number;

  @Prop({ required: true })
  tipoTramite: string;

  @Prop({ required: true })
  idTipoTramite: string;

  @Prop({ required: true })
  numeroProceso: number;

  @Prop({ required: true, default: 'PENDIENTE' })
  estado: string;
}

export const TramiteSchema = SchemaFactory.createForClass(Tramite);
TramiteSchema.pre('save', async function (next) {
  if (this.isNew) {
    const doc = this as TramiteDocument;
    const lastRecord = await this.model('Tramite')
      .findOne({})
      .sort({ numeroTramite: -1 })
      .select('numeroTramite');
    if (lastRecord) {
      doc.numeroTramite =
        (lastRecord as unknown as TramiteDocument).numeroTramite + 1;
    } else {
      doc.numeroTramite = 1;
    }
  }
  next();
});
