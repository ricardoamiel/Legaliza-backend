// filepath: /c:/Users/Godel/Documents/GitHub/legaliza-backend-nest-main/src/modules/transferencia_vehicular/transferencia_vehicular.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransferenciaVehicularDto } from './dto/create-transferencia_vehicular.dto';
import { UpdateTransferenciaVehicularDto } from './dto/update-transferencia_vehicular.dto';
import { TransferenciaVehicular, TransferenciaVehicularDocument } from './schema/transferencia_vehicular.schema';
import { Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { FilesService } from '../files/files.service';
import { AuthService } from '../auth/auth.service';
import { enviarCorreo } from 'src/common/email/envio-email';

@Injectable()
export class TransferenciaVehicularService {
  constructor(
    @InjectModel(TransferenciaVehicular.name)
    private readonly TransferenciaVehicularModel: Model<TransferenciaVehicularDocument>,

    private readonly usuarioService: UsersService,

    private readonly tramiteService: TramitesService,
    
    private readonly filesService: FilesService, // Inyectar el servicio de archivos
    
    private readonly authService: AuthService,
  ) {}

  async create(createTransferenciaVehicularDto: CreateTransferenciaVehicularDto) {
    const usuario = createTransferenciaVehicularDto.datosVendedor[0];
    const email = usuario['correo'];    

    let usuarioData = await this.usuarioService.findOneByEmail(email);

    if (!usuarioData) {
      const [nombres, apellidos] = email.split('@')[0].split('.');
      
      usuario['nombres'] = nombres || "";
      usuario['apellidos'] = apellidos || "";
      usuario['email'] = email;
      usuario['tipoUsuario'] = 'CLIENTE';
      console.log(usuario);
      usuarioData = await this.usuarioService.createUser(usuario);
    }
    
    // Validar y guardar IDs de archivos
    const datosVehiculo = createTransferenciaVehicularDto.datosVehiculo;

    if (datosVehiculo.soatVigente) {
      const soatFile = await this.filesService.findFileById(datosVehiculo.soatVigente);
      console.log(soatFile);
      if (!soatFile) {
        throw new BadRequestException('El archivo SOAT no existe en la base de datos.');
      }
    }

    if (datosVehiculo.tarjetaPropiedad) {
      const tarjetaFile = await this.filesService.findFileById(datosVehiculo.tarjetaPropiedad);
      console.log(tarjetaFile);
      if (!tarjetaFile) {
        throw new BadRequestException('El archivo Tarjeta de Propiedad no existe en la base de datos.');
      }
    }

    for (const vendedor of createTransferenciaVehicularDto.datosVendedor) {
      if (vendedor.copiaLiteral) {
        const copiaFile = await this.filesService.findFileById(vendedor.copiaLiteral);
        console.log(copiaFile);
        if (!copiaFile) {
          throw new BadRequestException('El archivo Copia Literal no existe en la base de datos.');
        }
      }
    }
    
    const lastRecord = await this.TransferenciaVehicularModel.findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.TransferenciaVehicularModel.create({
      ...createTransferenciaVehicularDto,
      idUsuario: usuarioData['_id'],
      numeroProceso: numeroProceso,
    });

    const dataTramite = await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'transferencia-vehicular',
      idUsuario: usuarioData['_id'],
      numeroProceso: data['numeroProceso'],
    });
    
    // Enviar correo si faltan documentos
    const documentosFaltantes = [];
    if (!datosVehiculo.soatVigente) {
      documentosFaltantes.push('SOAT Vigente');
    }
    if (!datosVehiculo.tarjetaPropiedad) {
      documentosFaltantes.push('Tarjeta de Propiedad');
    }
    for (const vendedor of createTransferenciaVehicularDto.datosVendedor) {
      if (!vendedor.copiaLiteral) {
        documentosFaltantes.push('Copia Literal');
      }
    }

    if (documentosFaltantes.length > 0) {
      const getToken = await this.authService.getToken({ email: email });
      const linkToken = `${process.env.FRONTEND_URL}/transferencia-vehicular/${data._id}?token=${getToken}`;

      enviarCorreo(
        email,
        `Transferencia Vehicular Numero Tramite: ${dataTramite.numeroTramite}`,
        `Falta adjuntar los siguientes documentos:
          <ul>
            ${documentosFaltantes.map(doc => `<li>${doc}</li>`).join('')}
          </ul>
          <p>Link: <a href="${linkToken}">${linkToken}</a></p>`,
      );
    }
    
    const payload = {
      status: 'success',
      message: 'Transferencia Vehicular creado con éxito',
    };

    return payload;
  }

  findAll() {
    return this.TransferenciaVehicularModel.find().exec();
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

    const existingRecord = await this.TransferenciaVehicularModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Transferencia Vehicular no encontrado',
      });
    }

    return {
      status: 'success',
      mesages: 'Transferencia Vehicular encontrado',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    idUsuario: string;
    updateTransferenciaVehicularDto: UpdateTransferenciaVehicularDto;
    tipoUsuario: string;
  }) {
    const { id, updateTransferenciaVehicularDto, idUsuario, tipoUsuario } = values;

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

    const existingRecord = await this.TransferenciaVehicularModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Transferencia Vehicular no encontrado',
      });
    }

    const data = { ...updateTransferenciaVehicularDto };

    const updated = await this.TransferenciaVehicularModel.findOneAndUpdate(
      filter,
      data,
      {
        new: true,
      },
    );

    return {
      status: 'success',
      message: 'Transferencia Vehicular actualizado con éxito',
      data: updated,
    };
  }

  async remove(id: string): Promise<TransferenciaVehicular> {
    const deletedRecord = await this.TransferenciaVehicularModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'transferencia-vehicular',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}