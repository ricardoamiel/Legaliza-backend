import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileStorage, FileStorageSchema } from './schema/file.schema';

@Module({
  imports: [
    // Add your imports here
    MongooseModule.forFeature([
      {
        name: FileStorage.name,
        schema: FileStorageSchema,
      },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService], // Asegúrate de exportar FilesService
})
export class FilesModule {}
