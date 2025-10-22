import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreatedUserDto } from './Dtos/createUser.dto';
import { CredentialRepository } from 'src/credential/credential.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly credentialRepository: CredentialRepository,
  ) {}
  getAllUserService() {
    return this.usersRepository.getAllUserRepository();
  }

  getUserByIdService(uuid: string) {
    return this.usersRepository.getUserByIdRepository(uuid);
  }

  getUserByNameService(name: string) {
    return this.usersRepository.getUserByNameRepository(name);
  }

  async postCreateUserService(createUserDto: CreatedUserDto) {
    const emailExisting = await this.usersRepository.getUserByEmail(
      createUserDto.email,
    );
    if (emailExisting) {
      throw new ConflictException('Este correo ya se encuentra registrado');
    }

    const usernameExisting =
      await this.credentialRepository.getCredentialByUsername(
        createUserDto.userName,
      );
    if (usernameExisting) {
      throw new ConflictException(
        'Este nombre de usuario ya se encuentra en uso',
      );
    }
    const phoneNumberExisting = await this.usersRepository.getByUserPhoneNumber(
      createUserDto.phoneNumber,
    );
    if (phoneNumberExisting) {
      throw new ConflictException('Este numero de telefono ya esta en uso');
    }
    return this.usersRepository.createUserRepository(createUserDto);
  }

  // putUpdateUser(user: IUserUpdate) {
  //   const { id, name, email } = user;
  //   if (!email || !name) {
  //     throw new ConflictException(
  //       'El correo electronico y el nombre son obligatorio',
  //     );
  //   }
  //   const userExisting = this.usersRepository.getUserByIdTwoRepository(id);
  //   if (!userExisting) {
  //     throw new NotFoundException('Este Usuario no existe');
  //   }
  //   return this.usersRepository.getUpdateUserRepository(user);
  // }
}
