import { Module } from '@nestjs/common';
import { EscrituraPublicaService } from './escritura_publica.service';
import { EscrituraPublicaController } from './escritura_publica.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EscrituraPublica,
  EscrituraPublicaSchema,
} from './schema/escritura_publica.schema';
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
        name: EscrituraPublica.name,
        schema: EscrituraPublicaSchema,
      },
    ]),
  ],
  controllers: [EscrituraPublicaController],
  providers: [EscrituraPublicaService],
})
export class EscrituraPublicaModule {}
