import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  getAllUserService() {
    return this.usersRepository.getAllUserRepository();
  }

  getUserByIdService(id: string) {
    return this.usersRepository.getUserByIdRepository(id);
  }
}
