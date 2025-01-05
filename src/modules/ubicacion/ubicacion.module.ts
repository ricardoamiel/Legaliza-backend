import { Module } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionController } from './ubicacion.controller';
import { InitDepartamentosService } from './services/InitDepartamentosService';
import { Departamento, DepartamentoSchema } from './schema/departamento.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Provincia, ProvinciaSchema } from './schema/provincia.schema';
import { InitProvinciasService } from './services/InitProvinciasService';
import { Distrito, DistritoSchema } from './schema/distrito.schema';
import { InitDistritosService } from './services/InitDistritosService';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Departamento.name, schema: DepartamentoSchema },
      { name: Provincia.name, schema: ProvinciaSchema },
      { name: Distrito.name, schema: DistritoSchema },
    ]),
  ],
  controllers: [UbicacionController],
  providers: [
    UbicacionService,
    InitDepartamentosService,
    InitProvinciasService,
    InitDistritosService,
  ],
})
export class UbicacionModule {}
