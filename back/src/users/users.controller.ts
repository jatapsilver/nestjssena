import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatedUserDto } from './Dtos/createUser.dto';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { RolesGuard } from 'src/auth/Guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Ruta para obtener todos los usuarios
  @Get('getAllUser')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.USER)
  getAllUser(@Query('name') name: string) {
    if (name) {
      return this.usersService.getUserByNameService(name);
    }
    return this.usersService.getAllUserService();
  }

  @Get('getUserById/:uuid')
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.getUserByIdService(uuid);
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
  postCreateUser(@Body() createUserDto: CreatedUserDto) {
    return this.usersService.postCreateUserService(createUserDto);
  }

  // @Post('createUser')
  // @UseInterceptors(DateAdderInterceptor)
  // postCreateUser(@Body() user: IUser, @Req() request) {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   const modifiedUser = { ...user, createAt: request.now };
  //   return this.usersService.postCreateUserService(modifiedUser);
  // }

  // @Put('updateUser')
  // putUpdateUser(@Body() user: IUserUpdate) {
  //   return this.usersService.putUpdateUser(user);
  // }

  @Delete('deleteUser')
  deleteUser() {
    return 'ruta para eliminar un usuario';
  }
}
