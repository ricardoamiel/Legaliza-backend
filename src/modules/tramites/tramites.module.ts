import { Module } from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { TramitesController } from './tramites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tramite, TramiteSchema } from './schema/tramite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tramite.name,
        schema: TramiteSchema,
      },
    ]),
  ],
  controllers: [TramitesController],
  providers: [TramitesService],
  exports: [TramitesService],
})
export class TramitesModule {}
