import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { provinciasData } from './provincias';
import { Provincia, ProvinciaDocument } from '../schema/provincia.schema';

@Injectable()
export class InitProvinciasService implements OnModuleInit {
  constructor(
    @InjectModel(Provincia.name)
    private provinciaModel: Model<ProvinciaDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.provinciaModel.countDocuments();
    if (count === 0) {
      await this.provinciaModel.insertMany(provinciasData);
      console.log('Provincias inicializadas exitosamente.');
    }
  }
}
