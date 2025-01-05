import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DataDestinario } from '../interface/data_destinario.interface';
import { DataEntregaCarta } from '../interface/data_entrega.interface';
import { DataEnviador } from '../interface/data_enviador.interface';
import { DataRemitente } from '../interface/data_remitente.interface';

export type CartaNotarialDocument = HydratedDocument<CartaNotarial>;

@Schema({
  timestamps: true,
  collection: 'carta_notarial',
})
export class CartaNotarial {
  @Prop({ required: true })
  idUsuario: string;

  @Prop({ required: true })
  datoRemitentes: DataRemitente[];

  @Prop({ required: true })
  datoDestinatarios: DataDestinario[];

  @Prop({ required: true })
  datoEntregaCarta: DataEntregaCarta[];

  @Prop({ required: true })
  datoEnviador: DataEnviador[];

  @Prop()
  numeroProceso: number;
}

export const CartaNotarialSchema = SchemaFactory.createForClass(CartaNotarial);