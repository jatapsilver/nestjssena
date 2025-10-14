import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAuthGuard } from 'src/guards/user-auth.guard';
import { DateAdderInterceptor } from 'src/interceptors/date-adder.interceptor';

export interface IUser {
  name: string;
  email: string;
}

export interface IUserUpdate {
  id: number;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Ruta para obtener todos los usuarios
  @Get('getAllUser')
  @UseGuards(UserAuthGuard)
  getAllUser(@Query('name') name: string) {
    if (name) {
      return this.usersService.getUserByNameService(name);
    }
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

  @Get('profile')
  getUserProfile(@Headers('token') token: string) {
    if (token !== '12345') {
      throw new UnauthorizedException('Acceso no Autorizado. Token Invalido');
    }
    return `Soy el perfil del usuario con token: ${token}`;
  }

  @Post('createUser')
  @UseInterceptors(DateAdderInterceptor)
  postCreateUser(@Body() user: IUser, @Req() request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const modifiedUser = { ...user, createAt: request.now };
    return this.usersService.postCreateUserService(modifiedUser);
  }

  @Put('updateUser')
  putUpdateUser(@Body() user: IUserUpdate) {
    return this.usersService.putUpdateUser(user);
  }

  @Delete('deleteUser')
  deleteUser() {
    return 'ruta para eliminar un usuario';
  }
}
