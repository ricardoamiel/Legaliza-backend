import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileStorageDocument = HydratedDocument<FileStorage>;

@Schema({
  timestamps: true,
  collection: 'files_storage',
})
export class FileStorage {
  @Prop()
  filePath: string;

  @Prop()
  _fieldName: string;
}

export const FileStorageSchema = SchemaFactory.createForClass(FileStorage);
