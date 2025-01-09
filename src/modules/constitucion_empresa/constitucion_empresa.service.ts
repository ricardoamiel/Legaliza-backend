import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDatosConstitucionEmpresaDto } from './dto/create-datos_constitucion_empresa.dto';
import { UpdateDatosConstitucionEmpresaDto } from './dto/update-datos_constitucion_empresa.dto';
import { ConstitucionEmpresa } from './schema/constitucion_empresa.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { TramitesService } from '../tramites/tramites.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ConstitucionEmpresaService {
    constructor(
        @InjectModel(ConstitucionEmpresa.name)
        private readonly ConstitucionEmpresaModel: Model<ConstitucionEmpresa>,

        private readonly usuarioService: UsersService,

        private readonly tramiteService: TramitesService,
        
        private readonly authService: AuthService,
    ) { }

    async create(CreateDatosConstitucionEmpresaDto: CreateDatosConstitucionEmpresaDto) {
        const nombres = CreateDatosConstitucionEmpresaDto.representanteLegal[0].nombres;
        const email = nombres.toLowerCase().replace(/ /g, '.') + '@hotmail.com';
        let usuarioData = await this.usuarioService.findOneByEmail(email);

        if (!usuarioData) {
            const [nom_, ap_] = email.split('@')[0].split('.');
            const usuario = {
                nombres: nom_ || "",
                apellidos: ap_ || " ",
                email: email,
                tipoUsuario: 'CLIENTE',
            }
            usuarioData = await this.usuarioService.createUser(
                usuario
            );
            console.log(usuario);
        }

        const lastRecord = await this.ConstitucionEmpresaModel.findOne({})
            .sort({ numeroProceso: -1 })
            .select('numeroProceso')
            .exec();
        
        let numeroProceso = 1;

        if (lastRecord && !isNaN(lastRecord.numeroProceso)) {
            numeroProceso = lastRecord.numeroProceso + 1;
        }

        const data = await this.ConstitucionEmpresaModel.create({
            ...CreateDatosConstitucionEmpresaDto,
            idUsuario: usuarioData['_id'],
            numeroProceso: numeroProceso,
        });

        await this.tramiteService.create({
            idUsuario: usuarioData['_id'],
            idTipoTramite: data['_id'].toString(),
            tipoTramite: 'constitucion-empresa',
            numeroProceso: data['numeroProceso'],
        });
        const payload = {
            status: 'success',
            message: 'Datos de constitución de empresa creados correctamente'
        }

        return payload;
    }

    findAll() {
        return this.ConstitucionEmpresaModel.find().exec();
    }

    // Needs update
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
    
        const existingRecord = await this.ConstitucionEmpresaModel.findOne(filter);
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
        updateDatosConstitucionEmpresaDto: UpdateDatosConstitucionEmpresaDto;
        tipoUsuario: string;
      }) {
        const { id, updateDatosConstitucionEmpresaDto, idUsuario, tipoUsuario } = values;
    
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
    
        const existingRecord = await this.ConstitucionEmpresaModel.findOne(filter);
        if (!existingRecord) {
          throw new BadRequestException({
            status: 'error',
            message: 'Datos de constitución de empresa no encontrados',
          });
        }
    
        const data = { ...updateDatosConstitucionEmpresaDto };
    
        const updated = await this.ConstitucionEmpresaModel.findOneAndUpdate(
          filter,
          data,
          {
            new: true,
          },
        );
    
        if (!updated) {
          throw new BadRequestException({
            status: 'error',
            message: 'Error al actualizar los datos de constitución de empresa',
          });
        }
    
        return {
          status: 'success',
          message: 'Datos de constitución de empresa actualizados correctamente',
          data: updated,
        };

    }

    async remove(id: string): Promise<ConstitucionEmpresa> {
        const deletedRecord = await this.ConstitucionEmpresaModel
          .findOneAndDelete({
            numeroProceso: id,
          })
          .exec();
    
        if (deletedRecord) {
          await this.tramiteService.deleteByTipoTramiteAndIdTipoTramite(
            'constitucion-empresa',
            deletedRecord._id.toString(),
          );
        }
    
        return deletedRecord;
      }

}