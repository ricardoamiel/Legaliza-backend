import { Module } from '@nestjs/common';
import { AperturaLibrosService } from './apertura_libros.service';
import { AperturaLibrosController } from './apertura_libros.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AperturaLibro,
  AperturaLibroSchema,
} from './schema/apertura_libro.schema';
import { FilesModule } from '../files/files.module';
import { TramitesModule } from '../tramites/tramites.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TramitesModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: AperturaLibro.name,
        schema: AperturaLibroSchema,
      },
    ]),
    FilesModule,
  ],

  controllers: [AperturaLibrosController],
  providers: [AperturaLibrosService],
})
export class AperturaLibrosModule {}
