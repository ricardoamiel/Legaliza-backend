import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermisoViajeDto } from './dto/create-permiso_viaje.dto';
import { PermisoViaje, PermisoViajeDocument } from './schema/permiso_viaje.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { UpdatePermisoViajeDto } from './dto/update-permiso_viaje.dto';
import { AuthService } from '../auth/auth.service';
import { enviarCorreo } from 'src/common/email/envio-email';
import { FilesService } from '../files/files.service'; // Import FilesService

@Injectable()
export class PermisoViajesService {
  constructor(
    @InjectModel(PermisoViaje.name)
    private readonly permisoViajeModel: Model<PermisoViajeDocument>,

    private readonly usuarioService: UsersService,

    private readonly tramiteService: TramitesService,

    private readonly authService: AuthService,
    
    private readonly filesService: FilesService, // Inject FilesService
  ) {}

  async create(createPermisoViajeDto: CreatePermisoViajeDto) {
    const email = createPermisoViajeDto.datoPadres[0].email;
    const errores: string[] = [];
    
    console.log(email);
    
    let usuarioData = await this.usuarioService.findOneByEmail(email);

    if (!usuarioData) {
      const [nombres, apellidos] = email.split('@')[0].split('.');
      const usuario = {
        nombres: nombres || "",
        apellidos: apellidos || " ",
        email: email,
        tipoUsuario: 'CLIENTE',
      };
      console.log(usuario);
      usuarioData = await this.usuarioService.createUser(usuario);
    }
    
    // Validate and save file IDs
    for (const padre of createPermisoViajeDto.datoPadres) {
      const id_anverso= padre.idADocumentoIdentidadAnverso;
      const id_reverso = padre.idDocumentoIdentidadReverso;
      if (id_anverso) {
        const archivoFile = await this.filesService.findFileById(id_anverso);
        console.log(archivoFile);
        if (!archivoFile) {
          throw new BadRequestException('El archivo de permiso no existe en la base de datos.');
        }
      }
      if (id_reverso) {
        const archivoFile = await this.filesService.findFileById(id_reverso);
        console.log(archivoFile);
        if (!archivoFile) {
          throw new BadRequestException('El archivo de permiso no existe en la base de datos.');
        }
      }
    }

    for (const menor of createPermisoViajeDto.datoMenores) {
      const id_anverso= menor.idADocumentoIdentidadAnverso;
      const id_reverso = menor.idDocumentoIdentidadReverso;
      if (id_anverso) {
        const archivoFile = await this.filesService.findFileById(id_anverso);
        console.log(archivoFile);
        if (!archivoFile) {
          throw new BadRequestException('El archivo de permiso no existe en la base de datos.');
        }
      }
      if (id_reverso) {
        const archivoFile = await this.filesService.findFileById(id_reverso);
        console.log(archivoFile);
        if (!archivoFile) {
          throw new BadRequestException('El archivo de permiso no existe en la base de datos.');
        }
      }
    }
    
    const lastRecord = await this.permisoViajeModel
      .findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.permisoViajeModel.create({
      ...createPermisoViajeDto,
      idUsuario: usuarioData['_id'],
      numeroProceso: numeroProceso,
    });

    const dataTramite = await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'permiso-de-viaje',
      idUsuario: usuarioData['_id'],
      numeroProceso: data.numeroProceso,
    });

    createPermisoViajeDto.datoMenores.forEach((menor) => {
      if (!menor.idADocumentoIdentidadAnverso) {
        errores.push(
          `Falta DocumentoIdentidadAnverso para el menor Numero Documento: ${menor.numeroDocumento}`,
        );
      }
      if (!menor.idDocumentoIdentidadReverso) {
        errores.push(
          `Falta DocumentoIdentidadReverso para el menor Numero Documento: ${menor.numeroDocumento}`,
        );
      }
    });

    createPermisoViajeDto.datoPadres.forEach((padre) => {
      if (!padre.idADocumentoIdentidadAnverso) {
        errores.push(
          `Falta DocumentoIdentidadAnverso para el Padres o Apoderado Numero Documento:  ${padre.numeroDocumento}`,
        );
      }
      if (!padre.idDocumentoIdentidadReverso) {
        errores.push(
          `Falta DocumentoIdentidadReverso para el Padres o Apoderado Numero Documento: : ${padre.numeroDocumento}`,
        );
      }
    });
    if (errores.length > 0) {
      const getToken = await this.authService.getToken({
        email: email,
      });
      const linkToken = `${process.env.FRONTEND_URL}/permiso-de-viaje/${data._id}?token=${getToken}`;
      const listaErrores = errores.map((error) => `<li>${error}</li>`).join('');

      enviarCorreo(
        email,
        `Permiso de Viajes Numero Tramite: ${dataTramite.numeroTramite}`,
        `Falta adjuntar los siguientes documentos:
          <ul>
            ${listaErrores}
          </ul>
          <p>Link: <a href="${linkToken}">${linkToken}</a></p>`,
      );
    }

    const payload = {
      status: 'success',
      message: 'Permiso de viaje creado con éxito',
    };

    return payload;
  }

  findAll() {
    return this.permisoViajeModel.find().exec();
  }

  async findOne(values: {
    permisoViajeId: string;
    userId: string;
    tipoUsuario: string;
  }) {
    const { permisoViajeId, userId, tipoUsuario } = values;

    if (tipoUsuario !== 'CLIENTE' && tipoUsuario !== 'ADMINISTRADOR') {
      throw new BadRequestException({
        status: 'error',
        message: 'Tipo de usuario no válido.',
      });
    }
    const filter: any = { numeroProceso: permisoViajeId };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = userId;
    }

    const existingRecord = await this.permisoViajeModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Permiso de viaje no encontrado.',
      });
    }

    return {
      status: 'success',
      mesages: 'Permiso de viaje encontrado',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    idUsuario: string;
    updatePermisoViajeDto: UpdatePermisoViajeDto;
    tipoUsuario: string;
  }) {
    const { id, updatePermisoViajeDto, idUsuario, tipoUsuario } = values;

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

    const existingRecord = await this.permisoViajeModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Permiso de viaje no encontrado',
      });
    }

    const data = { ...updatePermisoViajeDto };
    delete data.usuario;

    const updated = await this.permisoViajeModel.findOneAndUpdate(
      filter,
      data,
      {
        new: true,
      },
    );

    return {
      status: 'success',
      message: 'Permiso de viaje actualizado con éxito',
      data: updated,
    };
  }
  
  async remove(id: string): Promise<PermisoViaje> {
    const deletedRecord = await this.permisoViajeModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'permiso-de-viaje',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}
