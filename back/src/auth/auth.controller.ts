import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso, token generado.',
  })
  @Post('iniciarSesion')
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signInService(loginUserDto);
  }
}
