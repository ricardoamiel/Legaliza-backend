import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatus } from '../enums/user-status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop({ required: true })// , default: 'CLIENTE' })
  tipoUsuario: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: UserStatus.ACTIVE })
  status: UserStatus;
  
  @Prop()
  fotoPerfil: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
