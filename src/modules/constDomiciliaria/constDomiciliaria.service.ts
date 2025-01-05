import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConstDomiciliariaDto } from './dto/create-constDomiciliaria';
import { UpdateConstDomiciliariaDto } from './dto/update-create-constDomiciliaria';
import { constDomiciliaria, constDomiciliariaDocument } from './schema/constDomiciliaria.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { AuthService } from '../auth/auth.service';
import { enviarCorreo } from 'src/common/email/envio-email';
import { FilesService } from '../files/files.service'; // Import FilesService

@Injectable()
export class ConstDomiciliariaService {
  constructor(
    @InjectModel(constDomiciliaria.name)
    private readonly constDomiciliariaModel: Model<constDomiciliariaDocument>,

    private readonly usuarioService: UsersService,

    private readonly tramiteService: TramitesService,

    private readonly authService: AuthService,
    
    private readonly filesService: FilesService, // Inject FilesService
  ) {}

  async create(CreateConstDomiciliariaDto: CreateConstDomiciliariaDto) {
    const email = CreateConstDomiciliariaDto.correo;
    const nombres = CreateConstDomiciliariaDto.nombres;
    const apPat = CreateConstDomiciliariaDto.apellidoPaterno;
    const apMat = CreateConstDomiciliariaDto.apellidoMaterno;
    console.log(email);
    
    let usuarioData = await this.usuarioService.findOneByEmail(email);

    if (!usuarioData) {
      const usuario = {
        nombres: nombres,
        apellidos: apPat + ' ' + apMat,
        email: email,
        tipoUsuario: 'CLIENTE',
      };
      usuarioData = await this.usuarioService.createUser(usuario,);
    }
    
    // Validate and save file IDs
    if (CreateConstDomiciliariaDto.documentoCopiaLiteral) {
      const archivoFile = await this.filesService.findFileById(CreateConstDomiciliariaDto.documentoCopiaLiteral);
      console.log(archivoFile);
      if (!archivoFile) {
        throw new BadRequestException('El archivo Copia Literal no existe en la base de datos.');
      }
    }

    const lastRecord = await this.constDomiciliariaModel
      .findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.constDomiciliariaModel.create({
      ...CreateConstDomiciliariaDto,
      idUsuario: usuarioData['_id'],
      numeroProceso: numeroProceso,
    });

    const dataTramite = await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'constatacion-domiciliaria',
      idUsuario: usuarioData['_id'],
      numeroProceso: data['numeroProceso'],
    });
    console.log(CreateConstDomiciliariaDto);

    if (!CreateConstDomiciliariaDto.documentoCopiaLiteral) {
      const getToken = await this.authService.getToken({
        email: email,
      });
      const linkToken = `${process.env.FRONTEND_URL}/constatacion-domiciliaria/${data._id}?token=${getToken}`;
      console.log(linkToken);

      enviarCorreo(
        email,
        `Constatacion Domiciliaria Numero Tramite: ${dataTramite.numeroTramite}`,
        `Falta adjuntar los siguientes documentos:
          <ul>
            <li>Falta el Archivo de Copia Literal</li>
      
          </ul>
          <p>Link: <a href="${linkToken}">${linkToken}</a></p>`,
      );
    }
    const payload = {
      status: 'success',
      message: 'Constatación Domiciliaria creado con éxito',
    };
    return payload;
  }

  async findAll(): Promise<constDomiciliaria[]> {
    return this.constDomiciliariaModel.find().exec();
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
        message: 'Tipo de usuario no válido.',
      });
    }
    const filter: any = { numeroProceso: id };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = idUsuario;
    }

    const existingRecord = await this.constDomiciliariaModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Constatación Domiciliaria no encontrado',
      });
    }

    return {
      status: 'success',
      mesages: 'Constatación Domiciliaria encontrado',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    idUsuario: string;
    updateConstDomiciliariaDto: UpdateConstDomiciliariaDto;
    tipoUsuario: string;
  }) {
    const { id, updateConstDomiciliariaDto, idUsuario, tipoUsuario } = values;

    if (tipoUsuario !== 'CLIENTE' && tipoUsuario !== 'ADMINISTRADOR') {
      throw new BadRequestException({
        status: 'error',
        message: 'Tipo de usuario no válido',
      });
    }
    const filter: any = { numeroProceso: id };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = idUsuario;
    }

    const existingRecord = await this.constDomiciliariaModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Constatación Domiciliaria no encontrado',
      });
    }

    const data = { ...updateConstDomiciliariaDto };
    delete data.usuario;

    const updated = await this.constDomiciliariaModel.findOneAndUpdate(
      filter,
      data,
      {
        new: true,
      },
    );

    return {
      status: 'success',
      message: 'Constatación Domiciliaria actualizado con éxito',
      data: updated,
    };
  }

  async remove(id: string): Promise<constDomiciliaria> {
    const deletedRecord = await this.constDomiciliariaModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'constatacion-domiciliaria',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}
