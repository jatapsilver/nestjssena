import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, IUserUpdate } from './users.controller';

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
    {
      id: 4,
      name: 'John Doe',
      email: 'john.doe2@example.com',
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

  getUserByNameRepository(name: string) {
    const users = this.users.filter((user) => user.name === name);
    if (users.length <= 0) {
      throw new NotFoundException('No existe usuarios con ese nombre');
    }
    return users;
  }

  getUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  postCreateUserRepository(user: IUser) {
    const id = this.users.length + 1;
    const newUser = { id, ...user };
    console.log(newUser);
    this.users.push(newUser);
    return this.users;
  }

  getUserByIdTwoRepository(id: number) {
    return this.users.find((user) => user.id === id);
  }

  getUpdateUserRepository(user: IUserUpdate) {
    const userExisting = this.users.find((user) => user.id === user.id);
    if (!userExisting) {
      throw new NotFoundException('Este Usuario no existe');
    }
    userExisting.email = user.email;
    userExisting.name = user.name;
    return userExisting;
  }
}
