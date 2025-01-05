import { Module } from '@nestjs/common';
import { ConstitucionEmpresaService } from './constitucion_empresa.service';
import { ConstitucionEmpresaController } from './constitucion_empresa.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConstitucionEmpresa,
  ConstitucionEmpresaSchema,
} from './schema/constitucion_empresa.schema';
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
        name: ConstitucionEmpresa.name,
        schema: ConstitucionEmpresaSchema,
      },
    ]),
  ],
  controllers: [ConstitucionEmpresaController],
  providers: [ConstitucionEmpresaService],
})
export class ConstitucionEmpresaModule {}