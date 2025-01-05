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
import { PoderFueraRegistrosService } from './poder_fuera_registros.service';
import { CreatePoderFueraRegistroDto } from './dto/create-poder_fuera_registro.dto';
import { UpdatePoderFueraRegistroDto } from './dto/update-poder_fuera_registro.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('poder-fuera-registros')
@ApiBearerAuth()
export class PoderFueraRegistrosController {
  constructor(
    private readonly poderFueraRegistrosService: PoderFueraRegistrosService,
  ) {}

  @Post()
  async create(
    @Body() createPoderFueraRegistroDto: CreatePoderFueraRegistroDto,
  ) {
    return this.poderFueraRegistrosService.create(createPoderFueraRegistroDto);
  }

  @Get()
  findAll() {
    return this.poderFueraRegistrosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const { user } = req;
    return await this.poderFueraRegistrosService.findOne({
      id: id,
      idUsuario: user.id.toString(),
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePoderFueraRegistroDto: UpdatePoderFueraRegistroDto,
    @Req() req: RequestWithUser,
  ) {
    const { user } = req;

    return this.poderFueraRegistrosService.update({
      id: id,
      idUsuario: user.id,
      tipoUsuario: user.tipoUsuario,
      updatePoderFueraRegistroDto: updatePoderFueraRegistroDto,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.poderFueraRegistrosService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el poder fuera de registros');
    }
  }
}