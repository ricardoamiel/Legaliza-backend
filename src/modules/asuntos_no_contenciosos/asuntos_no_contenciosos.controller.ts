import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { AsuntosNoContenciososService } from './asuntos_no_contenciosos.service';
import { CreateAsuntosNoContenciososDto } from './dto/create-asuntos_no_contenciosos.dto';
import { UpdateAsuntosNoContenciososDto } from './dto/update-asuntos_no_contenciosos.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
//import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@ApiBearerAuth()
@Controller('asuntos-no-contenciosos')
export class AsuntosNoContenciososController {
  constructor(
    private readonly asuntosNoContenciososService: AsuntosNoContenciososService,
  ) {}

  @Post()
  async create(
    @Body() createAsuntosNoContenciososDto: CreateAsuntosNoContenciososDto,
  ) {
    return await this.asuntosNoContenciososService.create(
      createAsuntosNoContenciososDto,
    );
  }
  
  @Get()
  findAll() {
    return this.asuntosNoContenciososService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: RequestWithUser) {
    const { user } = req;

    return this.asuntosNoContenciososService.findOne({
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
    @Body() updateAsuntosNoContenciososDto: UpdateAsuntosNoContenciososDto,
  ) {
    const { user } = req;
    return await this.asuntosNoContenciososService.update({
      id: id,
      idUsuario: user.id,
      updateAsuntosNoContenciososDto: updateAsuntosNoContenciososDto,
      tipoUsuario: user.tipoUsuario,
    });
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.asuntosNoContenciososService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el asunto no contencioso');
    }
  }
}
