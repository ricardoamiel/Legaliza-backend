import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AperturaLibrosModule } from './modules/apertura_libros/apertura_libros.module';
import { FilesModule } from './modules/files/files.module';
import { PermisoViajesModule } from './modules/permiso_viajes/permiso_viajes.module';
import { PoderFueraRegistrosModule } from './modules/poder_fuera_registros/poder_fuera_registros.module';
import { TramitesModule } from './modules/tramites/tramites.module';
import { EscrituraPublicaModule } from './modules/escritura_publica/escritura_publica.module';
import { AsuntosNoContenciososModule } from './modules/asuntos_no_contenciosos/asuntos_no_contenciosos.module';
import { ConstDomiciliariaModule } from './modules/constDomiciliaria/constDomiciliaria.module';
import { CartaNotarialModule } from './modules/carta_notarial/carta_notarial.module';
import { TransferenciaVehicularModule } from './modules/transferencia_vehicular/transferencia_vehicular.module';
import { ConstitucionEmpresaModule } from './modules/constitucion_empresa/constitucion_empresa.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      //`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@127.0.0.1:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=legaliza-db`,
      //`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb.railway.internal:${process.env.MONGO_PORT}?authSource=admin`,
      `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@viaduct.proxy.rlwy.net:${process.env.MONGO_PORT_UR}?authSource=admin`,
    ),
    AuthModule,
    UsersModule,
    EscrituraPublicaModule,
    AsuntosNoContenciososModule,
    AperturaLibrosModule,
    FilesModule,
    PermisoViajesModule,
    PoderFueraRegistrosModule,
    TramitesModule,
    ConstDomiciliariaModule,
    CartaNotarialModule,
    TransferenciaVehicularModule,
    ConstitucionEmpresaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
