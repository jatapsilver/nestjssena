import { Injectable, NotFoundException } from '@nestjs/common';
import { CredentialRepository } from 'src/credential/credential.repository';
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly credencialRepository: CredentialRepository) {}
  async signInService(loginUserDto: LoginUserDto) {
    const userExisting =
      await this.credencialRepository.getCredentialByUsername(
        loginUserDto.userName,
      );
    if (!userExisting) {
      throw new NotFoundException('Credenciales Invalidadas');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const validatePassword = await bcrypt.compare(
      loginUserDto.password,
      userExisting.password,
    );
    if (!validatePassword) {
      throw new NotFoundException('Credenciales Invalidadas');
    }
    return 'Inicio de sesion correcto';
  }
}
