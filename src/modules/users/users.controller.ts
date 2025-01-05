import { Controller, Get, Put, Delete, Body, Param, NotFoundException, InternalServerErrorException, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserPrincipalDto } from './dto/update-user-principal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneById(@Param('id') id: string, @Req() req: RequestWithUser) {
    // Verificar que el usuario autenticado solo pueda acceder a su propia cuenta
    if (req.user.id !== id && req.user.tipoUsuario !== 'ADMINISTRADOR') {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePrincipal(@Param('id') id: string, @Body() updateUserPrincipalDto: UpdateUserPrincipalDto, @Req() req: RequestWithUser) {
    try {
      // Verificar que el usuario autenticado solo pueda actualizar su propia cuenta
      if (req.user.id !== id && req.user.tipoUsuario !== 'ADMINISTRADOR') {
        throw new ForbiddenException('No tienes permisos para realizar esta acción');
      }

      const updatedUser = await this.usersService.updateUserPrincipal(id, updateUserPrincipalDto);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user in controller:', error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    try {
      // Verificar que el usuario autenticado solo pueda eliminar su propia cuenta
      if (req.user.id !== id && req.user.tipoUsuario !== 'ADMINISTRADOR') {
        throw new ForbiddenException('No tienes permisos para realizar esta acción');
      }

      const deletedUser = await this.usersService.removeUser(id);
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user in controller:', error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  async findAll() {
    return this.usersService.findAll();
  }
}