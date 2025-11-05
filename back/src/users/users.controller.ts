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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Ruta para obtener todos los usuarios
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente.' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nombre del usuario a buscar',
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente.' })
  @ApiBearerAuth()
  @Get('getUserById/:uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.getUserByIdService(uuid);
  }

  //ruta para obtener el perfil de usuario

  @ApiOperation({ summary: 'Obtener el perfil de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario obtenido exitosamente.',
  })
  @ApiBearerAuth()
  @Get('profile/:uuid')
  @UseGuards(AuthGuard)
  getUserProfile(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.getUserProfileService(uuid);
  }

  //ruta para crear un usuario

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @Post('createUser')
  postCreateUser(@Body() createUserDto: CreatedUserDto) {
    return this.usersService.postCreateUserService(createUserDto);
  }

  //ruta para actualizar un usuario

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiBearerAuth()
  @Put('updateUser')
  @UseGuards(AuthGuard)
  putUpdateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.putUpdateUserService(updateUserDto);
  }

  //ruta para hacer un softDelete del usuario

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente.',
  })
  @ApiBearerAuth()
  @Delete('deleteUser/:uuid')
  @UseGuards(AuthGuard)
  deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.deleteUserService(uuid);
  }
}
