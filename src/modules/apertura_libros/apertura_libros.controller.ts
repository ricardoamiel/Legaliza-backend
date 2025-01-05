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
import { AperturaLibrosService } from './apertura_libros.service';
import { CreateAperturaLibroDto } from './dto/create-apertura_libro.dto';
import { UpdateAperturaLibroDto } from './dto/update-apertura_libro.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
//import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';

@Controller('apertura-libros')
@ApiBearerAuth()
export class AperturaLibrosController {
  constructor(private readonly aperturaLibrosService: AperturaLibrosService) {}

  @Post()
  async create(@Body() createAperturaLibroDto: CreateAperturaLibroDto) {
    return this.aperturaLibrosService.create(createAperturaLibroDto);
  }

  @Get()
  async findAll() {
    return this.aperturaLibrosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const { user } = req;
    return this.aperturaLibrosService.findOne({
      id: id,
      idUsuario: user.id.toString(),
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateAperturaLibroDto: UpdateAperturaLibroDto,
    @Req() req: RequestWithUser,
  ) {
    const { user } = req;
    return this.aperturaLibrosService.update({
      id: id,
      idUsuario: user.id,
      updateAperturaLibroDto: updateAperturaLibroDto,
      tipoUsuario: user.tipoUsuario,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.aperturaLibrosService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el libro');
    }
  }
}
