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
import { ConstDomiciliariaService } from './constDomiciliaria.service';
import { CreateConstDomiciliariaDto } from './dto/create-constDomiciliaria';
import { UpdateConstDomiciliariaDto } from './dto/update-create-constDomiciliaria';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
//import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('const-domiciliaria')
export class ConstDomiciliariaController {
  constructor(
    private readonly constDomiciliariaService: ConstDomiciliariaService,
  ) {}

  @Post()
  async create(@Body() createConstDomiciliariaDto: CreateConstDomiciliariaDto) {
    return await this.constDomiciliariaService.create(
      createConstDomiciliariaDto,
    );
  }

  @Get()
  async findAll() {
    return this.constDomiciliariaService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: RequestWithUser) {
    const { user } = req;

    return this.constDomiciliariaService.findOne({
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
    @Body() updateConstDomiciliariaDto: UpdateConstDomiciliariaDto,
  ) {
    const { user } = req;
    return await this.constDomiciliariaService.update({
      id: id,
      idUsuario: user.id,
      updateConstDomiciliariaDto: updateConstDomiciliariaDto,
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.constDomiciliariaService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la constatación domiciliaria');
    }
  }
}
