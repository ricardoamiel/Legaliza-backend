import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEscrituraPublicaDto } from './dto/create-escritura_publica.dto';
import { UpdateEscrituraPublicaDto } from './dto/update-escritura_publica.dto';
import { EscrituraPublica, EscrituraPublicaDocument } from './schema/escritura_publica.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { AuthService } from '../auth/auth.service';
import { enviarCorreo } from 'src/common/email/envio-email';
import { FilesService } from '../files/files.service'; // Import FilesService

@Injectable()
export class EscrituraPublicaService {
  constructor(
    @InjectModel(EscrituraPublica.name)
    private readonly EscrituraPublicaModel: Model<EscrituraPublicaDocument>,

    private readonly usuarioService: UsersService,

    private readonly tramiteService: TramitesService,

    private readonly authService: AuthService,
    
    private readonly filesService: FilesService, // Inject FilesService
  ) {}

  async create(CreateEscrituraPublicaDto: CreateEscrituraPublicaDto) {
    //const usuario = CreateEscrituraPublicaDto.usuario;
    const email = CreateEscrituraPublicaDto.dataSolicitantes[0].correo;
    console.log(email);
    console.log(CreateEscrituraPublicaDto.dataSolicitantes[0].nombres);
    console.log(CreateEscrituraPublicaDto.dataSolicitantes[0].apellidoPaterno);
    console.log(CreateEscrituraPublicaDto.dataSolicitantes[0].apellidoMaterno);
    
    const errores: string[] = [];

    let usuarioData = await this.usuarioService.findOneByEmail(email);

    if (!usuarioData) {
      const usuario = {
        nombres: CreateEscrituraPublicaDto.dataSolicitantes[0].nombres,
        apellidos: CreateEscrituraPublicaDto.dataSolicitantes[0].apellidoPaterno + ' ' + CreateEscrituraPublicaDto.dataSolicitantes[0].apellidoMaterno,
        email: email,
        tipoUsuario: 'CLIENTE',
      }
      console.log(usuario);
      usuarioData = await this.usuarioService.createUser(
        usuario,
      );
    }

    // Validate and save file IDs
    for (const solicitante of CreateEscrituraPublicaDto.dataSolicitantes) {
      const dni = solicitante.documentoDni;
      const copiaLiteral = solicitante.documentoCopiaLiteral;
      if (dni) {
        const archivoFile = await this.filesService.findFileById(dni);
        console.log(archivoFile);
        if (!archivoFile) {
          throw new BadRequestException('El archivo DNI no existe en la base de datos.');
        }
      }

      if (copiaLiteral) {
        const archivoFile = await this.filesService.findFileById(copiaLiteral);
        console.log(archivoFile);
        if (!archivoFile) {
          throw new BadRequestException('El archivo Copia Literal no existe en la base de datos.');
        }
      }
    }
    
    const lastRecord = await this.EscrituraPublicaModel.findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.EscrituraPublicaModel.create({
      ...CreateEscrituraPublicaDto,
      idUsuario: usuarioData['_id'],
      numeroProceso: numeroProceso,
    });

    const dataTramite = await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'escritura-publica',
      idUsuario: usuarioData['_id'],
      numeroProceso: data.numeroProceso,
    });

    CreateEscrituraPublicaDto.dataSolicitantes.forEach(async (solicitante) => {
      if (!solicitante.documentoCopiaLiteral) {
        errores.push(
          `Falta Documento Copia Literal de ${solicitante.nombres} ${solicitante.apellidoPaterno} ${solicitante.apellidoMaterno}`,
        );
      }

      if (!solicitante.documentoDni) {
        errores.push(
          `Falta Documento DNI de ${solicitante.nombres} ${solicitante.apellidoPaterno} ${solicitante.apellidoMaterno}`,
        );
      }
    });

    if (errores.length > 0) {
      const getToken = await this.authService.getToken({
        email: email,
      });
      const linkToken = `${process.env.FRONTEND_URL}/escritura-publica/${data._id}?token=${getToken}`;
      const listaErrores = errores.map((error) => `<li>${error}</li>`).join('');

      enviarCorreo(
        email,
        `Escritura Publica Tramite: ${dataTramite.numeroTramite}`,
        `Falta adjuntar los siguientes documentos:
          <ul>
            ${listaErrores}
          </ul>
          <p>Link: <a href="${linkToken}">${linkToken}</a></p>`,
      );
    }

    const payload = {
      status: 'success',
      message: 'Escritura Pública creado con éxito',
    };

    return payload;
  }

  findAll() {
    return this.EscrituraPublicaModel.find().exec();
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

    const existingRecord = await this.EscrituraPublicaModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Escritura Pública no encontrado.',
      });
    }

    return {
      status: 'success',
      mesages: 'Escritura Pública encontrado',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    idUsuario: string;
    updateEscrituraPublicaDto: UpdateEscrituraPublicaDto;
    tipoUsuario: string;
  }) {
    const { id, updateEscrituraPublicaDto, idUsuario, tipoUsuario } = values;

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

    const existingRecord = await this.EscrituraPublicaModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Escritura Pública no encontrado.',
      });
    }

    const data = { ...updateEscrituraPublicaDto };
    delete data.usuario;

    const updated = await this.EscrituraPublicaModel.findOneAndUpdate(
      filter,
      data,
      {
        new: true,
      },
    );

    return {
      status: 'success',
      message: 'Escritura Pública actualizado con éxito',
      data: updated,
    };
  }

  async remove(id: string): Promise<EscrituraPublica> {
    const deletedRecord = await this.EscrituraPublicaModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'escritura-publica',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}
