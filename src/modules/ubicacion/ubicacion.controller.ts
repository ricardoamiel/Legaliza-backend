import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';

@Controller('ubicacion')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

  @Get('departamentos')
  async getDepartamentos() {
    return {
      status: 'success',
      messages: 'Exitoso',
      data: await this.ubicacionService.getDepartamentos(),
    };
  }

  @Get('provincias/:departamentoId')
  async getProvincias(@Param('departamentoId') departamentoId: string) {
    const provincia = await this.ubicacionService.getProvincias(departamentoId);
    if (!provincia) {
      throw new BadRequestException({
        status: 'error',
        messages: 'Departamento no encontrado',
      });
    }
    return { status: 'success', messages: 'Exitoso', data: provincia };
  }

  @Get('distritos/:provinciaId')
  async getDistritos(@Param('provinciaId') provinciaId: string) {
    const distrito = await this.ubicacionService.getDistritos(provinciaId);
    if (!distrito) {
      throw new BadRequestException({
        status: 'error',
        messages: 'Provincia no encontrada',
      });
    }

    return { status: 'success', messages: 'Exitoso', data: distrito };
  }
}
