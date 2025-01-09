import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAsuntosNoContenciososDto } from './dto/create-asuntos_no_contenciosos.dto';
import { UpdateAsuntosNoContenciososDto } from './dto/update-asuntos_no_contenciosos.dto';
import { AsuntosNoContenciosos, AsuntosNoContenciososDocument } from './schema/asuntos_no_contenciosos.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { FilesService } from '../files/files.service';
import { AuthService } from '../auth/auth.service';
import { enviarCorreo } from 'src/common/email/envio-email';

@Injectable()
export class AsuntosNoContenciososService {
  constructor(
    @InjectModel(AsuntosNoContenciosos.name)
    private readonly AsuntosNoContenciososModel: Model<AsuntosNoContenciososDocument>,

    private readonly usuarioService: UsersService,

    private readonly tramiteService: TramitesService,
    
    private readonly filesService: FilesService, // Inject Files
    
    private readonly authService: AuthService,
  ) {}

  async create(CreateAsuntosNoContenciososDto: CreateAsuntosNoContenciososDto) {
    const email = CreateAsuntosNoContenciososDto.dataContratantes[0].correo;
    
    console.log(email);
    console.log(CreateAsuntosNoContenciososDto.dataContratantes[0].nombres);
    console.log(CreateAsuntosNoContenciososDto.dataContratantes[0].apellidoPaterno);
    console.log(CreateAsuntosNoContenciososDto.dataContratantes[0].apellidoMaterno);
    
    let usuarioData = await this.usuarioService.findOneByEmail(email);

    if (!usuarioData) {
      const usuario = {
        nombres: CreateAsuntosNoContenciososDto.dataContratantes[0].nombres,
        apellidos: CreateAsuntosNoContenciososDto.dataContratantes[0].apellidoPaterno + ' ' + CreateAsuntosNoContenciososDto.dataContratantes[0].apellidoMaterno,
        email: email,
        tipoUsuario: 'CLIENTE',
      }
      console.log(usuario);
      usuarioData = await this.usuarioService.createUser(usuario,);
    }

    const fileIds = ['file1', 'file2', 'file3', 'file4'];
    for (const fileId of fileIds) {
      if (CreateAsuntosNoContenciososDto[fileId]) {
        const archivoFile = await this.filesService.findFileById(CreateAsuntosNoContenciososDto[fileId]);
        console.log(archivoFile);
        if (!archivoFile) {
          throw new BadRequestException(`El archivo ${fileId} no existe en la base de datos.`);
        }
      }
    }
    
    const lastRecord = await this.AsuntosNoContenciososModel.findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.AsuntosNoContenciososModel.create({
      ...CreateAsuntosNoContenciososDto,
      idUsuario: usuarioData['_id'],
      numeroProceso: numeroProceso,
    });

    const dataTramite = await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'asuntos-no-contenciosos',
      idUsuario: usuarioData['_id'],
      numeroProceso: data.numeroProceso,
    });

    // Enviar correo si faltan documentos
    const documentosFaltantes = [];
    for (const contratante of CreateAsuntosNoContenciososDto.dataContratantes) {
      if (!contratante.tipoDocumento) {
        documentosFaltantes.push('DNI/CE/Pasaporte/PPT');
      }
    }
    for (const fileId of fileIds) {
      if (!CreateAsuntosNoContenciososDto[fileId]) {
        documentosFaltantes.push(fileId);
      }
    }

    if (documentosFaltantes.length > 0) {
      const getToken = await this.authService.getToken({ email: email });
      const linkToken = `${process.env.FRONTEND_URL}/asuntos-no-contenciosos/${data._id}?token=${getToken}`;

      enviarCorreo(
        email,
        `Asuntos No Contenciosos Numero Tramite: ${dataTramite.numeroTramite}`,
        `Falta adjuntar los siguientes documentos:
          <ul>
            ${documentosFaltantes.map(doc => `<li>${doc}</li>`).join('')}
          </ul>
          <p>Link: <a href="${linkToken}">${linkToken}</a></p>`,
      );
    }
    
    const payload = {
      status: 'success',
      message: 'Asuntos No Contenciosos creado con éxito',
    };

    return payload;
  }
  
  findAll() {
    return this.AsuntosNoContenciososModel.find().exec();
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
        message: 'Tipo de usuario no válido',
      });
    }
    const filter: any = { numeroProceso: id };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = idUsuario;
    }

    const existingRecord =
      await this.AsuntosNoContenciososModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Asunto no Contencioso no encontrado',
      });
    }

    return {
      status: 'success',
      mesages: 'Asunto no Contencioso encontrado',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    idUsuario: string;
    updateAsuntosNoContenciososDto: UpdateAsuntosNoContenciososDto;
    tipoUsuario: string;
  }) {
    const { id, updateAsuntosNoContenciososDto, idUsuario, tipoUsuario } =
      values;

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

    const existingRecord =
      await this.AsuntosNoContenciososModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Asunto no Contencioso no encontrado',
      });
    }

    const data = { ...updateAsuntosNoContenciososDto };
    delete data.usuario;

    const updated = await this.AsuntosNoContenciososModel.findOneAndUpdate(
      filter,
      data,
      { new: true },
    );

    return {
      status: 'success',
      message: 'Asuntos No Contenciosos actualizado con éxito',
      data: updated,
    };
  }
  
  async remove(id: string): Promise<AsuntosNoContenciosos> {
    const deletedRecord = await this.AsuntosNoContenciososModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'asuntos-no-contenciosos',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}
