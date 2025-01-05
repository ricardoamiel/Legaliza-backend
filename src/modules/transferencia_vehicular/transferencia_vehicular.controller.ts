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
import { TransferenciaVehicularService } from './transferencia_vehicular.service';
import { CreateTransferenciaVehicularDto } from './dto/create-transferencia_vehicular.dto';
import { UpdateTransferenciaVehicularDto } from './dto/update-transferencia_vehicular.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('transferencia-vehicular')
export class TransferenciaVehicularController {
  constructor(private readonly transferenciaVehicularService: TransferenciaVehicularService) {}

  @Post()
  async create(@Body() createTransferenciaVehicularDto: CreateTransferenciaVehicularDto) {
    return await this.transferenciaVehicularService.create(createTransferenciaVehicularDto);
  }

  @Get()
  findAll() {
    return this.transferenciaVehicularService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: RequestWithUser) {
    const { user } = req;

    return this.transferenciaVehicularService.findOne({
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
    @Body() updateTransferenciaVehicularDto: UpdateTransferenciaVehicularDto,
  ) {
    const { user } = req;
    return await this.transferenciaVehicularService.update({
      id,
      idUsuario: user.id,
      updateTransferenciaVehicularDto: updateTransferenciaVehicularDto,
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.transferenciaVehicularService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la transferencia vehicular');
    }
  }
}