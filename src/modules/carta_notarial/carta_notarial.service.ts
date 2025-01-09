import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartaNotarialDto } from './dto/create-carta_notarial.dto';
import { UpdateCartaNotarialDto } from './dto/update-carta_notarial.dto';
import { CartaNotarial, CartaNotarialDocument } from './schema/carta_notarial.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';

@Injectable()
export class CartaNotarialService {
  constructor(
    @InjectModel(CartaNotarial.name)
    private readonly CartaNotarialModel: Model<CartaNotarialDocument>,

    private readonly usuarioService: UsersService,

    private readonly tramiteService: TramitesService,
  ) {}

  async create(CreateCartaNotarialDto: CreateCartaNotarialDto) {
    const nombres = CreateCartaNotarialDto.datoRemitentes.nombre;
    console.log(nombres);
    // intentar separar nombres si hay un espacio con un punto para el email
    const nombres_ = nombres.toLowerCase().replace(/ /g, '.');
    const email = nombres_ + '@hotmail.com';
    console.log(nombres_)
    console.log(email);
    let usuarioData = await this.usuarioService.findOneByEmail(email);

    if (!usuarioData) {
      const [nom_, ap_] = email.split('@')[0].split('.');
      const usuario = {
        nombres: nom_ || "",
        apellidos: ap_ || " ",
        email: email,
        tipoUsuario: 'CLIENTE',
      }
      console.log(usuario);
      usuarioData = await this.usuarioService.createUser(
        usuario
      );
    }

    const lastRecord = await this.CartaNotarialModel.findOne({})
      .sort({ numeroProceso: -1 })
      .select('numeroProceso')
      .exec();

    let numeroProceso = 1;
    if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
      numeroProceso = lastRecord.numeroProceso + 1;
    }

    const data = await this.CartaNotarialModel.create({
      ...CreateCartaNotarialDto,
      idUsuario: usuarioData['_id'],
      numeroProceso: numeroProceso,
    });

    await this.tramiteService.create({
      idTipoTramite: data['_id'].toString(),
      tipoTramite: 'carta-notarial',
      idUsuario: usuarioData['_id'],
      numeroProceso: data['numeroProceso'],
    });
    const payload = {
      status: 'success',
      message: 'Carta Notarial creado con éxito',
    };

    return payload;
  }

  findAll() {
    return this.CartaNotarialModel.find().exec();
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

    const existingRecord = await this.CartaNotarialModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Carta Notarial no encontrado',
      });
    }

    return {
      status: 'success',
      mesages: 'Carta Notarial encontrado',
      data: existingRecord,
    };
  }

  async update(values: {
    id: string;
    idUsuario: string;
    updateCartaNotarialDto: UpdateCartaNotarialDto;
    tipoUsuario: string;
  }) {
    const { id, updateCartaNotarialDto, idUsuario, tipoUsuario } = values;

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

    const existingRecord = await this.CartaNotarialModel.findOne(filter);
    if (!existingRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'Carta Notarial no encontrado',
      });
    }

    const data = { ...updateCartaNotarialDto };
    delete data.usuario;

    const updated = await this.CartaNotarialModel.findOneAndUpdate(
      filter,
      data,
      {
        new: true,
      },
    );

    return {
      status: 'success',
      message: 'Carta Notarial actualizado con éxito',
      data: updated,
    };
  }

  async remove(id: string): Promise<CartaNotarial> {
    const deletedRecord = await this.CartaNotarialModel
      .findOneAndDelete({
        numeroProceso: id,
      })
      .exec();

    if (deletedRecord) {
      await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
        'carta-notarial',
        deletedRecord._id.toString(),
      );
    }

    return deletedRecord;
  }
}
