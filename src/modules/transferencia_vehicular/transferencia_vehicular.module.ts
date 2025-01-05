// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/transferencia_vehicular.module.ts
import { Module } from '@nestjs/common';
import { TransferenciaVehicularService } from './transferencia_vehicular.service';
import { TransferenciaVehicularController } from './transferencia_vehicular.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransferenciaVehicular, TransferenciaVehicularSchema } from './schema/transferencia_vehicular.schema';
import { UsersModule } from '../users/users.module';
import { TramitesModule } from '../tramites/tramites.module';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TramitesModule,
    FilesModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: TransferenciaVehicular.name,
        schema: TransferenciaVehicularSchema,
      },
    ]),
  ],
  controllers: [TransferenciaVehicularController],
  providers: [TransferenciaVehicularService],
})
export class TransferenciaVehicularModule {}