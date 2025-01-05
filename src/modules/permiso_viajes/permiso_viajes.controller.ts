import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { PermisoViajesService } from './permiso_viajes.service';
import { CreatePermisoViajeDto } from './dto/create-permiso_viaje.dto';
import { UpdatePermisoViajeDto } from './dto/update-permiso_viaje.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('permiso-viajes')
@ApiBearerAuth()
export class PermisoViajesController {
  constructor(private readonly permisoViajesService: PermisoViajesService) {}

  @Post()
  async create(@Body() createPermisoViajeDto: CreatePermisoViajeDto) {
    return await this.permisoViajesService.create(createPermisoViajeDto);
  }

  @Get()
  findAll() {
    return this.permisoViajesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: RequestWithUser) {
    const { user } = req;

    return this.permisoViajesService.findOne({
      permisoViajeId: id,
      userId: user.id.toString(),
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Req() req: RequestWithUser,
    @Body() updatePermisoViajeDto: UpdatePermisoViajeDto,
  ) {
    const { user } = req;
    return await this.permisoViajesService.update({
      id: id,
      idUsuario: user.id,
      updatePermisoViajeDto: updatePermisoViajeDto,
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.permisoViajesService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el permiso de viaje');
    }
  }
}