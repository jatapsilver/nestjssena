import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  private users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
  ];
  getAllUserRepository() {
    console.log('Se devolvio la base de datos de todos los usuarios');
    return this.users;
  }

  getUserByIdRepository(id: string) {
    const user = this.users.find((user) => user.id === Number(id));
    if (!user) {
      throw new NotFoundException('No existe un usuario con ese id');
    }
    return user;
  }
}
