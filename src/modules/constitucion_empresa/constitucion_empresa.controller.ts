import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    Put,
    ParseIntPipe,
    InternalServerErrorException,
} from '@nestjs/common';

import { ConstitucionEmpresaService } from './constitucion_empresa.service';
import { CreateDatosConstitucionEmpresaDto } from './dto/create-datos_constitucion_empresa.dto';
import { UpdateDatosConstitucionEmpresaDto } from './dto/update-datos_constitucion_empresa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('constitucion-empresa')
export class ConstitucionEmpresaController {
    constructor(private readonly constitucionEmpresaService: ConstitucionEmpresaService) { }

    @Post()
    async create(@Body() createDatosConstitucionEmpresaDto: CreateDatosConstitucionEmpresaDto) {
        return await this.constitucionEmpresaService.create(createDatosConstitucionEmpresaDto);
    }

    @Get()
    findAll() {
        return this.constitucionEmpresaService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: string, @Req() req: RequestWithUser) {
      const { user } = req;

      return this.constitucionEmpresaService.findOne({
        id: id,
        idUsuario: user.id.toString(),
        tipoUsuario: user.tipoUsuario,
      });
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id', ParseIntPipe) id: string,
        @Req() req: RequestWithUser,
        @Body() updateDatosConstitucionEmpresaDto: UpdateDatosConstitucionEmpresaDto,
    ) {
        const { user } = req;
        return await this.constitucionEmpresaService.update({
            id: id,
            updateDatosConstitucionEmpresaDto: updateDatosConstitucionEmpresaDto,
            idUsuario: user.id,
            tipoUsuario: user.tipoUsuario,
        });
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        try {
        return await this.constitucionEmpresaService.remove(id);
        } catch (error) {
        throw new InternalServerErrorException('Error al eliminar la constitución de empresa');
        }
    }
}