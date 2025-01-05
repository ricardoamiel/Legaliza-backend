import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepartamentoDocument = HydratedDocument<Departamento>;

@Schema()
export class Departamento {
  @Prop({ required: true })
  DeparNom: string;

  @Prop({ required: true })
  DeparCodi: number;

  @Prop()
  __typename?: string;
}
export const DepartamentoSchema = SchemaFactory.createForClass(Departamento);
