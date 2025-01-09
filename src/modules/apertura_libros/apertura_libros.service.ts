import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAperturaLibroDto } from './dto/create-apertura_libro.dto';
import { UpdateAperturaLibroDto } from './dto/update-apertura_libro.dto';
import {
  AperturaLibro,
  AperturaLibroDocument,
} from './schema/apertura_libro.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { AuthService } from '../auth/auth.service';
import { enviarCorreo } from 'src/common/email/envio-email';
import { FilesService } from '../files/files.service'; // Import FilesService

@Injectable()
export class AperturaLibrosService {
  private readonly logger = new Logger(AperturaLibrosService.name);
  constructor(
    @InjectModel(AperturaLibro.name)
    private aperturaLibroModel: Model<AperturaLibroDocument>,

    private readonly usuarioService: UsersService,

    private readonly authService: AuthService,

    private readonly tramiteService: TramitesService,
    
    private readonly filesService: FilesService, // Inject FilesService
  ) {}

  async create(createAperturaLibroDto: CreateAperturaLibroDto) {
    const email = createAperturaLibroDto.correo;
    let usuarioData = await this.usuarioService.findOneByEmail(email);
    
    console.log(email)

    if (!usuarioData) {
      const [nombres, apellidos] = email.split('@')[0].split('.');
      const usuario = {
        nombres: nombres || "",
        apellidos: apellidos || " ",
        email: email,
        tipoUsuario: 'CLIENTE',
      };
      console.log(usuario)
      usuarioData = await this.usuarioService.createUser(usuario);
    }
    
    // Validar y guardar IDs de archivos
    const archivoAnversoFileId = createAperturaLibroDto.idADocumentoIdentidadAnverso;
    const archivoReversoFileId = createAperturaLibroDto.idDocumentoIdentidadReverso;
    
    if (archivoAnversoFileId) {
      const savedFile = await this.filesService.findFileById(archivoAnversoFileId);
      if (!savedFile) {
        throw new BadRequestException('El archivo Anverso no existe en la base de datos.');
      }
    }

    if (archivoReversoFileId) {
      const savedFile = await this.filesService.findFileById(archivoReversoFileId);
      if (!savedFile) {
        throw new BadRequestException('El archivo Reverso no existe en la base de datos.');
      }
    }

    const lastRecord = await this.aperturaLibroModel
      .findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.aperturaLibroModel.create({
      idUsuario: usuarioData['_id'],
      ...createAperturaLibroDto,
      numeroProceso: numeroProceso,
    });

    const dataTramite = await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'apertura-de-libro',
      idUsuario: usuarioData['_id'],
      numeroProceso: data.numeroProceso,
    });

    if (
      !createAperturaLibroDto.idADocumentoIdentidadAnverso ||
      !createAperturaLibroDto.idDocumentoIdentidadReverso
    ) {
      let nomIdADocumentoIdentidadAnverso = '';
      let nomIdDocumentoIdentidadReverso = '';

      if (!createAperturaLibroDto.idADocumentoIdentidadAnverso) {
        nomIdADocumentoIdentidadAnverso = 'DocumentoIdentidadAnverso';
      }
      if (!createAperturaLibroDto.idDocumentoIdentidadReverso) {
        nomIdDocumentoIdentidadReverso = 'DocumentoIdentidadReverso';
      }
      const getToken = await this.authService.getToken({
        email: email,
      });
      const linkToken = `${process.env.FRONTEND_URL}/apertura-de-libro/${data._id}?token=${getToken}`; // eslint-disable-line

      enviarCorreo(
        email,
        `Apertura de Libro Numero Tramite: ${dataTramite.numeroTramite}`,
        `Falta adjuntar los siguientes documentos:
          <ul>
            <li>${nomIdADocumentoIdentidadAnverso}</li>
            <li>${nomIdDocumentoIdentidadReverso}</li>
          </ul>
          <p>Link: <a href="${linkToken}">${linkToken}</a></p>`,
      );
    }
    return {
      status: 'success',
      message: 'AperturaLibro created successfully',
    };
  }

  async findAll(): Promise<AperturaLibro[]> {
    return this.aperturaLibroModel.find().exec();
  }

  async findOne(values: {
    id: string;
    idUsuario: string;
    tipoUsuario: string;
  }) {
    const { id, idUsuario, tipoUsuario } = values;

    if (tipoUsuario !== 'CLIENTE' && tipoUsuario !== 'ADMINISTRADOR') {
      throw new BadRequestException({
        status: 'error',
        message: 'Invalid user type',
      });
    }

    const filter: any = { numeroProceso: id };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = idUsuario;
    }

    const existingRecord = await this.aperturaLibroModel.findOne(filter);

    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'AperturaLibro not found',
      });
    }

    return {
      status: 'success',
      message: 'AperturaLibro found',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    updateAperturaLibroDto: UpdateAperturaLibroDto;
    idUsuario: string;
    tipoUsuario: string;
  }) {
    const { id, updateAperturaLibroDto, idUsuario, tipoUsuario } = values;

    if (tipoUsuario !== 'CLIENTE' && tipoUsuario !== 'ADMINISTRADOR') {
      throw new BadRequestException({
        status: 'error',
        message: 'Invalid user type',
      });
    }
    const filter: any = { numeroProceso: id };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = idUsuario;
    }

    const existingRecord = await this.aperturaLibroModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'AperturaLibro not found',
      });
    }

    const data = { ...updateAperturaLibroDto };
    delete data.usuario;
    const updatedRecord = await this.aperturaLibroModel.findOneAndUpdate(
      filter,
      data,
      {
        new: true,
      },
    );

    return {
      status: 'success',
      message: 'AperturaLibro updated successfully',
      data: updatedRecord,
    };
  }

  async remove(id: string): Promise<AperturaLibro> {
    const deletedRecord = await this.aperturaLibroModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'apertura-de-libro',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}
