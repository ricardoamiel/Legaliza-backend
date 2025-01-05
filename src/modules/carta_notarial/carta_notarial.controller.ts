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
import { CartaNotarialService } from './carta_notarial.service';
import { CreateCartaNotarialDto } from './dto/create-carta_notarial.dto';
import { UpdateCartaNotarialDto } from './dto/update-carta_notarial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
//import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('carta-notarial')
export class CartaNotarialController {
  constructor(private readonly cartaNotarialService: CartaNotarialService) {}

  @Post()
  async create(@Body() createCartaNotarialDto: CreateCartaNotarialDto) {
    return await this.cartaNotarialService.create(createCartaNotarialDto);
  }

  @Get()
  findAll() {
    return this.cartaNotarialService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: RequestWithUser) {
    const { user } = req;

    return this.cartaNotarialService.findOne({
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
    @Body() updateCartaNotarialDto: UpdateCartaNotarialDto,
  ) {
    const { user } = req;
    return await this.cartaNotarialService.update({
      id,
      idUsuario: user.id,
      updateCartaNotarialDto: updateCartaNotarialDto,
      tipoUsuario: user.tipoUsuario,
    });
  }
  
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.cartaNotarialService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la carta notarial');
    }
  }
}
