import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Query,
  InternalServerErrorException,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tramites')
@ApiBearerAuth()
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Post()
  async create(@Body() createTramiteDto: CreateTramiteDto) {
    try {
      return await this.tramitesService.create(createTramiteDto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el trámite');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req: RequestWithUser,
    @Body() updateTramiteDto: UpdateTramiteDto,
    @Param('id', MongoIdPipe) id: string,
  ) {
    const { user } = req;

    return this.tramitesService.update({
      id,
      updateTramiteDto,
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMINISTRADOR')
  async findAll(
    @Req() req: RequestWithUser,
    @Query('tipoTramite') tipoTramite: string,
    @Query('idUsuario') idUsuario: string,
    @Query('idTipoTramite') idTipoTramite?: string,
    @Query('nombres') nombreUsuario?: string,
    @Query('apellidos') apellidosUsuario?: string,
    @Query('numeroProceso') numeroProceso?: number,
    @Query('numeroTramite') numeroTramite?: number,
    @Query('sentidoOrden') sentidoOrden = 'desc',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('estado') estado?: string,
    @Query('fecha') fecha?: string,
  ) {
    const { user } = req;

    return this.tramitesService.findAll({
      tipoUsuario: user.tipoUsuario,
      idUsuario,
      tipoTramite,
      idTipoTramite,
      nombreUsuario,
      apellidosUsuario,
      numeroProceso,
      numeroTramite,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sentidoOrden,
      estado,
      fecha,
    });
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) numeroTramite: number) {
    try {
      return await this.tramitesService.findOne(numeroTramite);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el trámite');
    }
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) numeroTramite: string) {
    try {
      return await this.tramitesService.remove(numeroTramite);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el trámite');
    }
  }
  
  @Get('user/:idUsuario')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(
    @Req() req: RequestWithUser,
    @Param('idUsuario') idUsuario: string,
    @Query('tipoTramite') tipoTramite?: string,
    @Query('estado') estado?: string,
    @Query('fecha') fecha?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sentidoOrden') sentidoOrden = 'desc',
  ) {
    const { user } = req;

    // Verificar que el usuario autenticado solo pueda acceder a sus propios trámites
    if (user.tipoUsuario !== 'ADMINISTRADOR' && user.id !== idUsuario) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    return this.tramitesService.findAllByUser({
      idUsuario,
      tipoTramite,
      estado,
      fecha,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sentidoOrden,
    });
  }
}
