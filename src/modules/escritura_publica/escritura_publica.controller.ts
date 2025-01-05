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
import { EscrituraPublicaService } from './escritura_publica.service';
import { CreateEscrituraPublicaDto } from './dto/create-escritura_publica.dto';
import { UpdateEscrituraPublicaDto } from './dto/update-escritura_publica.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
//import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('escritura-publica')
@ApiBearerAuth()
export class EscrituraPublicaController {
  constructor(
    private readonly escrituraPublicaService: EscrituraPublicaService,
  ) {}

  @Post()
  async create(@Body() createEscrituraPublicaDto: CreateEscrituraPublicaDto) {
    return await this.escrituraPublicaService.create(createEscrituraPublicaDto);
  }

  @Get()
  findAll() {
    return this.escrituraPublicaService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: RequestWithUser) {
    const { user } = req;

    return this.escrituraPublicaService.findOne({
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
    @Body() updateEscrituraPublicaDto: UpdateEscrituraPublicaDto,
  ) {
    const { user } = req;
    return await this.escrituraPublicaService.update({
      id: id,
      idUsuario: user.id,
      updateEscrituraPublicaDto: updateEscrituraPublicaDto,
      tipoUsuario: user.tipoUsuario,
    });
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.escrituraPublicaService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la escritura pública');
    }
  }
}
