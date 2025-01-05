// init-departamentos.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Departamento,
  DepartamentoDocument,
} from '../schema/departamento.schema';

@Injectable()
export class InitDepartamentosService implements OnModuleInit {
  constructor(
    @InjectModel(Departamento.name)
    private departamentoModel: Model<DepartamentoDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.departamentoModel.countDocuments();
    if (count === 0) {
      const departamentos = [
        { DeparNom: 'AMAZONAS', DeparCodi: 1, __typename: 'Departamento' },
        { DeparNom: 'ANCASH', DeparCodi: 2, __typename: 'Departamento' },
        { DeparNom: 'APURIMAC', DeparCodi: 3, __typename: 'Departamento' },
        { DeparNom: 'AREQUIPA', DeparCodi: 4, __typename: 'Departamento' },
        { DeparNom: 'AYACUCHO', DeparCodi: 5, __typename: 'Departamento' },
        { DeparNom: 'CAJAMARCA', DeparCodi: 6, __typename: 'Departamento' },
        { DeparNom: 'CALLAO', DeparCodi: 7, __typename: 'Departamento' },
        { DeparNom: 'CUSCO', DeparCodi: 8, __typename: 'Departamento' },
        { DeparNom: 'HUANCAVELICA', DeparCodi: 9, __typename: 'Departamento' },
        { DeparNom: 'HUANUCO', DeparCodi: 10, __typename: 'Departamento' },
        { DeparNom: 'ICA', DeparCodi: 11, __typename: 'Departamento' },
        { DeparNom: 'JUNIN', DeparCodi: 12, __typename: 'Departamento' },
        { DeparNom: 'LA LIBERTAD', DeparCodi: 13, __typename: 'Departamento' },
        { DeparNom: 'LAMBAYEQUE', DeparCodi: 14, __typename: 'Departamento' },
        { DeparNom: 'LIMA', DeparCodi: 15, __typename: 'Departamento' },
        { DeparNom: 'LORETO', DeparCodi: 16, __typename: 'Departamento' },
        {
          DeparNom: 'MADRE DE DIOS',
          DeparCodi: 17,
          __typename: 'Departamento',
        },
        { DeparNom: 'MOQUEGUA', DeparCodi: 18, __typename: 'Departamento' },
        { DeparNom: 'PASCO', DeparCodi: 19, __typename: 'Departamento' },
        { DeparNom: 'PIURA', DeparCodi: 20, __typename: 'Departamento' },
        { DeparNom: 'PUNO', DeparCodi: 21, __typename: 'Departamento' },
        { DeparNom: 'SAN MARTIN', DeparCodi: 22, __typename: 'Departamento' },
        { DeparNom: 'TACNA', DeparCodi: 23, __typename: 'Departamento' },
        { DeparNom: 'TUMBES', DeparCodi: 24, __typename: 'Departamento' },
        { DeparNom: 'UCAYALI', DeparCodi: 25, __typename: 'Departamento' },
      ];
      await this.departamentoModel.insertMany(departamentos);
    }
  }
}
