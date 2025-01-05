import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { distritosData } from './distritos';
import { Distrito, DistritoDocument } from '../schema/distrito.schema';

@Injectable()
export class InitDistritosService implements OnModuleInit {
  constructor(
    @InjectModel(Distrito.name) private distritoModel: Model<DistritoDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.distritoModel.countDocuments();
    if (count === 0) {
      await this.distritoModel.insertMany(distritosData);
      console.log('Distritos inicializados exitosamente.');
    }
  }
}
