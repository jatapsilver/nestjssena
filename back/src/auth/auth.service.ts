import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CredentialRepository } from 'src/credential/credential.repository';
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly credencialRepository: CredentialRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signInService(loginUserDto: LoginUserDto) {
    const credentialExisting =
      await this.credencialRepository.getCredentialByUsername(
        loginUserDto.userName,
      );
    if (!credentialExisting) {
      throw new NotFoundException('Credenciales Invalidadas');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const validatePassword = await bcrypt.compare(
      loginUserDto.password,
      credentialExisting.password,
    );
    if (!validatePassword) {
      throw new NotFoundException('Credenciales Invalidadas');
    }
    if (credentialExisting.user_id.isActive === false) {
      throw new ConflictException(
        'El usuario esta inactivo comuniquese con el administrador',
      );
    }

    const payload = {
      id: credentialExisting.user_id.uuid,
      role: credentialExisting.roles,
      username: credentialExisting.userName,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Inicio de sesion exitoso',
      token,
    };
  }
}
