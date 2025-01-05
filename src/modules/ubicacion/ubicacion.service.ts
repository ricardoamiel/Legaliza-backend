import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Departamento } from './schema/departamento.schema';
import { Model } from 'mongoose';
import { Provincia } from './schema/provincia.schema';
import { Distrito } from './schema/distrito.schema';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectModel(Departamento.name)
    private readonly departamentoModel: Model<Departamento>,
    @InjectModel(Provincia.name)
    private readonly provinciaModel: Model<Provincia>,
    @InjectModel(Distrito.name)
    private readonly distritoModel: Model<Distrito>,
  ) {}

  async getDepartamentos() {
    return await this.departamentoModel.find();
  }

  async getProvincias(departamentoId: string) {
    return await this.provinciaModel.find({ depCode: departamentoId });
  }

  async getDistritos(provinciaId: string) {
    return await this.distritoModel.find({ proCode: provinciaId });
  }
}
