import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProvinciaDocument = HydratedDocument<Provincia>;
@Schema()
export class Provincia {
  @Prop({ required: true })
  ProvNom: string;

  @Prop({ required: true })
  ProvCodi: number;

  @Prop({ required: true })
  depCode: number;

  @Prop()
  __typename?: string;
}
export const ProvinciaSchema = SchemaFactory.createForClass(Provincia);
