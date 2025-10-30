import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreatedUserDto } from './Dtos/createUser.dto';
import { CredentialRepository } from 'src/credential/credential.repository';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly credentialRepository: CredentialRepository,
  ) {}
  //servicio para obtener todos los usuarios
  getAllUserService() {
    return this.usersRepository.getAllUserRepository();
  }

  //servicio para obtener un usuario por su id
  async getUserByIdService(uuid: string) {
    const userExisting = await this.usersRepository.getUserByIdRepository(uuid);
    if (!userExisting) {
      throw new NotFoundException('Este usuario no existe');
    }
    return userExisting;
  }

  // Servicio para buscar usuario por nombre
  async getUserByNameService(name: string) {
    const userExisting =
      await this.usersRepository.getUserByNameRepository(name);

    if (userExisting.length === 0) {
      throw new NotFoundException('No existe ningun usuario con este nombre');
    }
    return userExisting;
  }

  //servicio para obtener el perfil del usuario
  async getUserProfileService(uuid: string) {
    const userExisting = await this.usersRepository.getUserByIdRepository(uuid);
    if (!userExisting) {
      throw new NotFoundException('Este usuario no existe');
    }
    if (userExisting.isActive === false) {
      throw new ConflictException('Este usuario no esta activo');
    }
    return this.usersRepository.getUserProfileRepository(userExisting);
  }

  //servicio para crear un usuario
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

  async putUpdateUserService(updateUserDto: UpdateUserDto) {
    const userExisting = await this.usersRepository.getUserByIdRepository(
      updateUserDto.uuid,
    );
    if (!userExisting) {
      throw new NotFoundException('No existe el usuario');
    }
    if (userExisting.isActive === false) {
      throw new ConflictException('Este usuario no esta activo');
    }
    if (updateUserDto.email) {
      const emailExisting = await this.usersRepository.getUserByEmail(
        updateUserDto.email,
      );
      if (emailExisting) {
        throw new ConflictException('Este correo ya se encuentra registrado');
      }
    }

    if (updateUserDto.userName) {
      const usernameExisting =
        await this.credentialRepository.getCredentialByUsername(
          updateUserDto.userName,
        );
      if (usernameExisting) {
        throw new ConflictException(
          'Este nombre de usuario ya se encuentra en uso',
        );
      }
    }
    if (updateUserDto.phoneNumber) {
      const phoneNumberExisting =
        await this.usersRepository.getByUserPhoneNumber(
          updateUserDto.phoneNumber,
        );
      if (phoneNumberExisting) {
        throw new ConflictException('Este numero de telefono ya esta en uso');
      }
    }
    return this.usersRepository.putUpdateUserRepository(
      userExisting,
      updateUserDto,
    );
  }

  //servicio para hacer un softDelete del usuario
  async deleteUserService(uuid: string) {
    const userExisting = await this.usersRepository.getUserByIdRepository(uuid);
    if (!userExisting) {
      throw new NotFoundException('No existe el usuario');
    }
    if (userExisting.isActive === false) {
      throw new ConflictException('Este usuario ya no se encuentra activo');
    }
    return this.usersRepository.deleteUserRepository(userExisting);
  }
}
