import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatedUserDto } from './Dtos/createUser.dto';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Ruta para obtener todos los usuarios
  @Get('getAllUser')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getAllUser(@Query('name') name: string) {
    if (name) {
      return this.usersService.getUserByNameService(name);
    }
    return this.usersService.getAllUserService();
  }

  //ruta para obtener un usuario por su id
  @Get('getUserById/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.getUserByIdService(uuid);
  }

  //ruta para obtener el perfil de usuario
  @Get('profile/:uuid')
  @UseGuards(AuthGuard)
  getUserProfile(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.getUserProfileService(uuid);
  }

  //ruta para crear un usuario
  @Post('createUser')
  postCreateUser(@Body() createUserDto: CreatedUserDto) {
    return this.usersService.postCreateUserService(createUserDto);
  }

  //ruta para actualizar un usuario
  @Put('updateUser')
  @UseGuards(AuthGuard)
  putUpdateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.putUpdateUserService(updateUserDto);
  }

  //ruta para hacer un softDelete del usuario
  @Delete('deleteUser/:uuid')
  @UseGuards(AuthGuard)
  deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.deleteUserService(uuid);
  }
}
