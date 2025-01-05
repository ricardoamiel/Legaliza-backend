import { Module } from '@nestjs/common';
import { AsuntosNoContenciososService } from './asuntos_no_contenciosos.service';
import { AsuntosNoContenciososController } from './asuntos_no_contenciosos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AsuntosNoContenciosos,
  AsuntosNoContenciososSchema,
} from './schema/asuntos_no_contenciosos.schema';
import { UsersModule } from '../users/users.module';
import { TramitesModule } from '../tramites/tramites.module';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TramitesModule,
    AuthModule,
    FilesModule,
    MongooseModule.forFeature([
      {
        name: AsuntosNoContenciosos.name,
        schema: AsuntosNoContenciososSchema,
      },
    ]),
  ],
  controllers: [AsuntosNoContenciososController],
  providers: [AsuntosNoContenciososService],
})
export class AsuntosNoContenciososModule {}
