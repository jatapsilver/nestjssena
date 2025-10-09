import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { IUser, IUserUpdate } from './users.controller';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  getAllUserService() {
    return this.usersRepository.getAllUserRepository();
  }

  getUserByIdService(id: string) {
    return this.usersRepository.getUserByIdRepository(id);
  }

  getUserByNameService(name: string) {
    return this.usersRepository.getUserByNameRepository(name);
  }

  postCreateUserService(user: IUser) {
    if (!user.email || !user.name) {
      throw new ConflictException(
        'El correo electronico y el nombre son obligatorio',
      );
    }
    const userExisting = this.usersRepository.getUserByEmail(user.email);
    if (userExisting) {
      throw new ConflictException('Este correo ya se encuentra registrado');
    }
    return this.usersRepository.postCreateUserRepository(user);
  }

  putUpdateUser(user: IUserUpdate) {
    const { id, name, email } = user;
    if (!email || !name) {
      throw new ConflictException(
        'El correo electronico y el nombre son obligatorio',
      );
    }
    const userExisting = this.usersRepository.getUserByIdTwoRepository(id);
    if (!userExisting) {
      throw new NotFoundException('Este Usuario no existe');
    }
    return this.usersRepository.getUpdateUserRepository(user);
  }
}
