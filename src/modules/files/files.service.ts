import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileStorage, FileStorageDocument } from './schema/file.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class FilesService {
  private storagePath = path.join(__dirname, '..', '../../storage');

  constructor(
    @InjectModel(FileStorage.name)
    private fileStorageModel: Model<FileStorageDocument>,
  ) {
    // Crear la carpeta de almacenamiento si no existe
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }
  async create(file: Express.Multer.File): Promise<FileStorage> {
    // Generar un UUID para la subcarpeta
    const fileId = Math.random().toString(36).substring(10);
    const filePath = path.join(this.storagePath, fileId);

    // Crear la subcarpeta con UUID si no existe
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    // Guardar el archivo en la subcarpeta
    const fullFilePath = path.join(filePath, file.originalname);
    fs.writeFileSync(fullFilePath, file.buffer);

    // Registrar la información del archivo en la base de datos
    const createdFile = new this.fileStorageModel({
      filePath: fullFilePath,
      _fieldName: file.originalname,
    });
    return createdFile.save();
  }
  
  // files.service.ts
  async findFileById(fileId: string) {
    return this.fileStorageModel.findById(fileId).exec();
  }

}
