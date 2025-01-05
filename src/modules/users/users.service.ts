import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as crypto from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserPrincipalDto } from './dto/createUserPrincipal';
import { UpdateUserPrincipalDto } from './dto/update-user-principal.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userSessionModel: Model<User>) {}

  async findOneById(id: string): Promise<User> {
    const data = await this.userSessionModel.findById(id).exec();

    return data;
  }

  async findOneByEmail(email: string): Promise<User> {
    const data = await this.userSessionModel.findOne({ email }).exec();
    if (!data) return null;
    return data.toObject();
  }

  // Método para crear un usuario generando una contraseña aleatoria
  async createUser(user) {
    // Generar contraseña fija para el usuario que sea su nombre + 123
    // intentar separar nombres si hay un espacio con un punto para el email
    const nombres_ = user.nombres.toLowerCase().replace(/ /g, '.');
    const password = nombres_ + '123';
    const hash = crypto.createHash('sha512').update(password).digest('hex');

    const data = await this.userSessionModel.create({
      ...user,
      password: hash,
    });

    return data;
  }
  
  // Método que crea el usuario ADMINISTRADOR por defecto
  async createUserDefault(user) {
    const data = await this.userSessionModel.create(user);
    return data;
  }
  
  // Método para crear un usuario con contraseña definida
  async createUserPrincipal(createUserPrincipalDto: CreateUserPrincipalDto): Promise<User> {
    try {
      // Encriptar la contraseña
      createUserPrincipalDto.password = crypto.createHash('sha512').update(createUserPrincipalDto.password || '').digest('hex');
      const newUser = new this.userSessionModel(createUserPrincipalDto);
      return newUser.save();
    } catch (error) {
      console.error('Error creating user in service:', error);
      throw new InternalServerErrorException('Error creating user in service');
    }
  }
  
  // No puedes modificar la contraseña con este método
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userSessionModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      ).exec();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user in service:', error);
      throw new InternalServerErrorException('Error updating user in service');
    }
  }
  
  // Puedes modificar la contraseña con este
  async updateUserPrincipal(id: string, updateUserPrincipalDto: UpdateUserPrincipalDto): Promise<User> {
    try {
      // Si se está actualizando la contraseña, encriptarla
      if (updateUserPrincipalDto.password) {
        updateUserPrincipalDto.password = crypto.createHash('sha512').update(updateUserPrincipalDto.password).digest('hex');
      }

      const updatedUser = await this.userSessionModel.findByIdAndUpdate(
        id,
        updateUserPrincipalDto,
        { new: true },
      ).exec();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user in service:', error);
      throw new InternalServerErrorException('Error updating user in service');
    }
  }

  async removeUser(id: string): Promise<User> {
    const deletedUser = await this.userSessionModel.findByIdAndDelete(id).exec();
    return deletedUser;
  }
  
  // Método para obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.userSessionModel.find().exec();
  }
}
