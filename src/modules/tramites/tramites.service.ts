import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tramite } from './schema/tramite.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class TramitesService {
  constructor(
    @InjectModel(Tramite.name) private tramiteModel: Model<Tramite>,
  ) {}

  async create(createTramiteDto: CreateTramiteDto) {
    return await this.tramiteModel.create(createTramiteDto);
  }

  async update(values: {
    id: string;
    updateTramiteDto: UpdateTramiteDto;
    tipoUsuario: string;
  }) {
    const { id, updateTramiteDto, tipoUsuario } = values;
    if (tipoUsuario !== 'ADMINISTRADOR') {
      throw new BadRequestException({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción',
      });
    }

    const dataUpdate = await this.tramiteModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      updateTramiteDto,
      {
        new: true,
      },
    );

    if (!dataUpdate) {
      throw new BadRequestException({
        status: 'error',
        message: 'No se encontró el trámite especificado',
      });
    }

    return {
      status: 'success',
      message: 'Trámite actualizado correctamente',
      data: dataUpdate,
    };
  }
  
  async findOne(numeroTramite: number | string) {
    const tramite = await this.tramiteModel.findOne({ numeroTramite }).exec();
    if (!tramite) {
      throw new BadRequestException({
        status: 'error',
        message: 'No se encontró el trámite especificado',
      });
    }
    return {
      status: 'success',
      message: 'Trámite encontrado',
      data: tramite,
    };
  }
  
  async findAll(values: {
    tipoUsuario: string;
    idUsuario: string;
    idTipoTramite?: string;
    tipoTramite?: string;
    numeroProceso?: number | string;
    numeroTramite?: number | string;
    page: number;
    nombreUsuario?: string;
    apellidosUsuario?: string;
    sentidoOrden?: string;
    limit: number;
    estado?: string;
    fecha?: string;
  }) {
    const sortOrder = values.sentidoOrden === 'desc' ? -1 : 1;
    const sortField = 'createdAt'; // Campo predeterminado para ordenar

    /*if (values.tipoUsuario !== 'ADMINISTRADOR') {
      throw new BadRequestException({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción',
      });
    }*/

    // Validación de dependencias
    if (values.numeroProceso !== undefined && !values.tipoTramite) {
      throw new BadRequestException({
        status: 'error',
        message:
          'El tipo de trámite es requerido para buscar por número de proceso',
      });
    }

    const matchTramite: Record<string, any> = {};
    if (values.tipoTramite) {
      matchTramite.tipoTramite = values.tipoTramite;
    }

    if (values.numeroProceso !== undefined) {
      const numeroProceso =
        typeof values.numeroProceso === 'string'
          ? Number(values.numeroProceso)
          : values.numeroProceso;
      if (!isNaN(numeroProceso)) {
        matchTramite.numeroProceso = numeroProceso;
      } else {
        throw new BadRequestException({
          status: 'error',
          message: 'numeroProceso debe ser un número válido',
        });
      }
    }

    const matchUser: Record<string, any> = {};
    if (values.nombreUsuario) {
      matchUser['usuario.nombres'] = {
        $regex: values.nombreUsuario,
        $options: 'i',
      };
    }
    if (values.apellidosUsuario) {
      matchUser['usuario.apellidos'] = {
        $regex: values.apellidosUsuario,
        $options: 'i',
      };
    }

    if (values.numeroTramite !== undefined) {
      const numeroTramite =
        typeof values.numeroTramite === 'string'
          ? Number(values.numeroTramite)
          : values.numeroTramite;
      if (!isNaN(numeroTramite)) {
        matchTramite.numeroTramite = numeroTramite;
      } else {
        throw new BadRequestException({
          status: 'error',
          message: 'numeroTramite debe ser un número válido',
        });
      }
    }

    if (values.estado != undefined) {
      matchTramite.estado = values.estado;
    }

    if (values.fecha != undefined) {
      const fecha = parseISO(values.fecha);
      if (isValid(fecha)) {
        console.log(fecha);
        matchTramite.createdAt = {
          $gte: startOfDay(fecha),
          $lte: endOfDay(fecha),
        };
      } else {
        throw new BadRequestException({
          status: 'error',
          message: 'La fecha proporcionada no es válida',
        });
      }
    }
    const pipeline: PipelineStage[] = [
      { $match: matchTramite },
      {
        $lookup: {
          from: 'users',
          localField: 'idUsuario',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      { $unwind: '$usuario' },
      { $match: matchUser },
      {
        $sort: {
          [sortField]: sortOrder,
        },
      },
      {
        $facet: {
          metadata: [
            { $count: 'total' },
            { $addFields: { page: values.page } },
          ],
          data: [
            { $skip: (values.page - 1) * values.limit },
            { $limit: values.limit },
            {
              $project: {
                tipoTramite: 1,
                idUsuario: 1,
                idTipoTramite: 1,
                numeroProceso: 1,
                estado: 1,
                'usuario.nombres': 1,
                'usuario.apellidos': 1,
                'usuario.email': 1,
                numeroTramite: 1,
                createdAt: 1, // Asegurar que el campo de ordenamiento esté incluido
              },
            },
          ],
        },
      },
      { $unwind: '$metadata' },
      {
        $project: {
          total: '$metadata.total',
          page: '$metadata.page',
          limit: values.limit,
          data: 1,
        },
      },
    ];

    const result = await this.tramiteModel.aggregate(pipeline).exec();

    const total = result[0]?.total || 0;
    const totalPages = Math.ceil(total / values.limit);

    if (values.page > totalPages && totalPages !== 0) {
      throw new BadRequestException({
        status: 'error',
        message: 'La página solicitada no existe',
      });
    }

    return {
      data: result[0]?.data || [],
      total,
      page: values.page,
      limit: values.limit,
      totalPages,
    };
  }
  
  async deleteByTipoTramiteAndIdTipoTramite(tipoTramite: string, idTipoTramite: string) {
    return this.tramiteModel.findOneAndDelete({ tipoTramite, idTipoTramite }).exec();
  }
  
  async remove(id: string) {
    const deletedRecord = await this.tramiteModel
      .findOneAndDelete({
        numeroTramite: id,
      })
      .exec();

    if (!deletedRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'No se encontró el trámite especificado',
      });
    }

    return {
      status: 'success',
      message: 'Trámite eliminado correctamente',
      data: deletedRecord,
    };
  }
  
  async findAllByUser(values: {
    idUsuario: string;
    tipoTramite?: string;
    estado?: string;
    fecha?: string;
    page: number;
    limit: number;
    sentidoOrden?: string;
  }) {
    const { idUsuario, tipoTramite, estado, fecha, page, limit, sentidoOrden } = values;
    const objectId = new Types.ObjectId(idUsuario);
    const skip = (page - 1) * limit;
    const sortOrder = sentidoOrden === 'desc' ? -1 : 1;
    const sortField = 'createdAt'; // Campo predeterminado para ordenar

    const match: Record<string, any> = { idUsuario: objectId };

    if (tipoTramite) {
      match.tipoTramite = tipoTramite;
    }

    if (estado) {
      match.estado = estado;
    }

    if (fecha) {
      const parsedFecha = parseISO(fecha);
      if (isValid(parsedFecha)) {
        match.createdAt = {
          $gte: startOfDay(parsedFecha),
          $lte: endOfDay(parsedFecha),
        };
      } else {
        throw new BadRequestException({
          status: 'error',
          message: 'La fecha proporcionada no es válida',
        });
      }
    }

    const [data, total] = await Promise.all([
      this.tramiteModel.find(match).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).exec(),
      this.tramiteModel.countDocuments(match).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}