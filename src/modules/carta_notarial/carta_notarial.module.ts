import { Module } from '@nestjs/common';
import { CartaNotarialService } from './carta_notarial.service';
import { CartaNotarialController } from './carta_notarial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CartaNotarial,
  CartaNotarialSchema,
} from './schema/carta_notarial.schema';
import { UsersModule } from '../users/users.module';
import { TramitesModule } from '../tramites/tramites.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    UsersModule,
    TramitesModule,
    FilesModule,

    MongooseModule.forFeature([
      {
        name: CartaNotarial.name,
        schema: CartaNotarialSchema,
      },
    ]),
  ],
  controllers: [CartaNotarialController],
  providers: [CartaNotarialService],
})
export class CartaNotarialModule {}
