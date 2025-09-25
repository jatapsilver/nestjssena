import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Ruta para obtener todos los usuarios
  @Get('getAllUser')
  getAllUser() {
    return this.usersService.getAllUserService();
  }

  @Get('getUserById')
  getUserById() {
    return this.usersService.getUserByIdService();
  }

  @Post('createUser')
  postCreateUser() {
    return 'ruta para crear un usuario';
  }

  @Put('updateUser')
  putUpdateUser() {
    return 'ruta para actualizar un usuario';
  }

  @Delete('deleteUser')
  deleteUser() {
    return 'ruta para eliminar un usuario';
  }
}
