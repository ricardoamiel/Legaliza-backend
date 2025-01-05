import { Module } from '@nestjs/common';
import { PoderFueraRegistrosService } from './poder_fuera_registros.service';
import { PoderFueraRegistrosController } from './poder_fuera_registros.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PoderFueraRegistro,
  PoderFueraRegistroSchema,
} from './schema/poder_fuera_registro.schema';
import { TramitesModule } from '../tramites/tramites.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    UsersModule,
    TramitesModule,
    AuthModule,
    FilesModule, // Import FilesService
    MongooseModule.forFeature([
      {
        name: PoderFueraRegistro.name,
        schema: PoderFueraRegistroSchema,
      },
    ]),
  ],
  controllers: [PoderFueraRegistrosController],
  providers: [PoderFueraRegistrosService],
})
export class PoderFueraRegistrosModule {}
