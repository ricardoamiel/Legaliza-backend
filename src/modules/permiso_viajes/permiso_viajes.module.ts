import { Module } from '@nestjs/common';
import { PermisoViajesService } from './permiso_viajes.service';
import { PermisoViajesController } from './permiso_viajes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PermisoViaje,
  PermisoViajeSchema,
} from './schema/permiso_viaje.schema';
import { UsersModule } from '../users/users.module';
import { TramitesModule } from '../tramites/tramites.module';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    UsersModule,
    TramitesModule,
    AuthModule,
    FilesModule,
    MongooseModule.forFeature([
      {
        name: PermisoViaje.name,
        schema: PermisoViajeSchema,
      },
    ]),
  ],

  controllers: [PermisoViajesController],
  providers: [PermisoViajesService],
})
export class PermisoViajesModule {}
