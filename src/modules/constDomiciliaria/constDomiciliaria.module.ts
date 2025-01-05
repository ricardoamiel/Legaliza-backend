import { Module } from '@nestjs/common';
import { ConstDomiciliariaService } from './constDomiciliaria.service';
import { ConstDomiciliariaController } from './constDomiciliaria.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  constDomiciliaria,
  constDomiciliariaSchema,
} from './schema/constDomiciliaria.schema';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';
import { TramitesModule } from '../tramites/tramites.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TramitesModule,
    FilesModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: constDomiciliaria.name,
        schema: constDomiciliariaSchema,
      },
    ]),
    FilesModule,
  ],

  controllers: [ConstDomiciliariaController],
  providers: [ConstDomiciliariaService],
})
export class ConstDomiciliariaModule {}
