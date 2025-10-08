import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Ruta para obtener todos los usuarios
  @Get('getAllUser')
  getAllUser() {
    return this.usersService.getAllUserService();
  }

  @Get('getUserById/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserByIdService(id);
  }

  @HttpCode(418)
  @Get('coffees')
  makeCoffe() {
    return 'No puedo preparar cafe soy una tetera';
  }

  @HttpCode(400)
  @Get()
  findAll() {
    return { message: 'Usuarios no encontrados' };
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
