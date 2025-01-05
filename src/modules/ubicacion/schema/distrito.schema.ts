import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DistritoDocument = HydratedDocument<Distrito>;
@Schema()
export class Distrito {
  @Prop({ required: true })
  DistCodi: number;

  @Prop({ required: true })
  DistNom: string;

  @Prop({ required: true })
  proCode: number;

  @Prop()
  __typename?: string;
}
export const DistritoSchema = SchemaFactory.createForClass(Distrito);
