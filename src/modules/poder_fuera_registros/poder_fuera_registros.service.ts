import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePoderFueraRegistroDto } from './dto/create-poder_fuera_registro.dto';
import { PoderFueraRegistro, PoderFueraRegistroDocument } from './schema/poder_fuera_registro.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { UpdatePoderFueraRegistroDto } from './dto/update-poder_fuera_registro.dto';
import { AuthService } from '../auth/auth.service';
import { enviarCorreo } from 'src/common/email/envio-email';
import { FilesService } from '../files/files.service'; // Import FilesService

@Injectable()
export class PoderFueraRegistrosService {
  constructor(
    @InjectModel(PoderFueraRegistro.name)
    private poderFueraRegistroModel: Model<PoderFueraRegistroDocument>,

    private readonly usuarioService: UsersService,

    private readonly tramiteService: TramitesService,

    private readonly authService: AuthService,
    
    private readonly filesService: FilesService, // Inject FilesService
  ) {}

  async create(createPoderFueraRegistroDto: CreatePoderFueraRegistroDto) {
    const nombres = createPoderFueraRegistroDto.datoClientes[0].nombres;
    const apellidoP = createPoderFueraRegistroDto.datoClientes[0].apellidoPaterno;
    const apellidoM = createPoderFueraRegistroDto.datoClientes[0].apellidoMaterno;
    const errores: string[] = [];
    
    console.log(nombres);
    console.log(apellidoP);
    console.log(apellidoM);
    
    // pasar a minusculas nombres y apellidos
    const email = nombres.toLowerCase().replace(/\s/g, '') + '.' + apellidoP.toLowerCase().replace(/\s/g, '') + '@hotmail.com';
    
    let usuarioData = await this.usuarioService.findOneByEmail(email);

    if (!usuarioData) {
      console.log(email);
      const usuario = {
        nombres: nombres,
        apellidos: apellidoP + ' ' + apellidoM,
        email: email,
        tipoUsuario: 'CLIENTE',
      };
      console.log(usuario);
      usuarioData = await this.usuarioService.createUser(usuario);
    }
    
    // Validate and save file IDs
    for (const cliente of createPoderFueraRegistroDto.datoClientes) {
      const id_anverso= cliente.idADocumentoIdentidadAnverso;
      const id_reverso = cliente.idDocumentoIdentidadReverso;
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

    const lastRecord = await this.poderFueraRegistroModel
      .findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.poderFueraRegistroModel.create({
      ...createPoderFueraRegistroDto,
      idUsuario: usuarioData['_id'],
      numeroProceso: numeroProceso,
    });

    const dataTramite = await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'poder-fuera-de-registro',
      idUsuario: usuarioData['_id'],
      numeroProceso: data.numeroProceso,
    });

    createPoderFueraRegistroDto.datoClientes.forEach(async (datoCliente) => {
      if (!datoCliente.idADocumentoIdentidadAnverso) {
        errores.push(
          'Falta el Documento Identidad Anverso del cliente Numero Documento: ' +
            datoCliente.numeroDocumento,
        );
      }

      if (!datoCliente.idDocumentoIdentidadReverso) {
        errores.push(
          'Falta el Documento Identidad Reverso del cliente Numero Documento: ' +
            datoCliente.numeroDocumento,
        );
      }
    });
    if (errores.length > 0) {
      const getToken = await this.authService.getToken({
        email: email,
      });

      const linkToken = `${process.env.FRONTEND_URL}/poder-fuera-de-registro/${data._id}?token=${getToken}`;
      const listaErrores = errores.map((error) => `<li>${error}</li>`).join('');

      enviarCorreo(
        email,
        `Poder Fuera de Registro Numero Tramite: ${dataTramite.numeroTramite}`,
        `Falta adjuntar los siguientes documentos:
          <ul>
            ${listaErrores}
          </ul>
          <p>Link: <a href="${linkToken}">${linkToken}</a></p>`,
      );
    }

    const payload = {
      status: 'success',
      messages: 'Poder fuera de registro creado correctamente',
      data: data,
    };

    return payload;
  }

  findAll() {
    return this.poderFueraRegistroModel.find().exec();
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
        messages: 'Tipo de usuario no válido',
      });
    }
    const filter: any = { numeroProceso: id };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = idUsuario;
    }

    const existingRecord = await this.poderFueraRegistroModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        messages: 'Poder fuera de registro no encontrado',
      });
    }

    return {
      status: 'success',
      messages: 'Poder fuera de registro encontrado',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    updatePoderFueraRegistroDto: UpdatePoderFueraRegistroDto;
    tipoUsuario: string;
    idUsuario: string;
  }) {
    const { id, updatePoderFueraRegistroDto, idUsuario, tipoUsuario } = values;
    if (tipoUsuario !== 'CLIENTE' && tipoUsuario !== 'ADMINISTRADOR') {
      throw new BadRequestException({
        status: 'error',
        messages: 'Tipo de usuario no válido',
      });
    }
    const filter: any = { numeroProceso: id };
    if (tipoUsuario === 'CLIENTE') {
      filter.idUsuario = idUsuario;
    }

    const existingRecord = await this.poderFueraRegistroModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        messages: 'Poder fuera de registro no encontrado',
      });
    }

    const { ...dataPoder } = updatePoderFueraRegistroDto;

    const updatedRecord = await this.poderFueraRegistroModel.findOneAndUpdate(
      filter,
      dataPoder,
      { new: true },
    );

    return {
      status: 'success',
      messages: 'Poder fuera de registro actualizado correctamente',
      tipoUsuario: tipoUsuario,
      data: updatedRecord,
    };
  }
  
  async remove(id: string): Promise<PoderFueraRegistro> {
    const deletedRecord = await this.poderFueraRegistroModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'poder-fuera-de-registro',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}
