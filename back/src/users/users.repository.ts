import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreatedUserDto } from './Dtos/createUser.dto';
import { Credential } from 'src/entities/credential.entity';
import * as bcrypt from 'bcrypt';

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

  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}
  getAllUserRepository() {
    console.log('Se devolvio la base de datos de todos los usuarios');
    return this.users;
  }

  async getUserByIdRepository(uuid: string) {
    const user = await this.userDataBase.findOne({
      where: { uuid: uuid },
      relations: ['credential_id'],
    });
    if (!user) {
      throw new NotFoundException('No existe un usuario con ese id');
    }
    return user;
  }

  // Esta era la ruta inicial para obtener un usuario con la base hardcodeada
  // getUserByIdRepository(id: string) {
  //   const user = this.users.find((user) => user.id === Number(id));
  //   if (!user) {
  //     throw new NotFoundException('No existe un usuario con ese id');
  //   }
  //   return user;
  // }

  getUserByNameRepository(name: string) {
    const users = this.users.filter((user) => user.name === name);
    if (users.length <= 0) {
      throw new NotFoundException('No existe usuarios con ese nombre');
    }
    return users;
  }

  async getUserByEmail(email: string) {
    return await this.userDataBase.findOne({ where: { email: email } });
  }

  async getByUserPhoneNumber(phoneNumber: number) {
    return await this.userDataBase.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  async createUserRepository(createUserDto: CreatedUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const newCredential = this.credentialDataBase.create({
      userName: createUserDto.userName,
      password: hashedPassword,
    });
    await this.credentialDataBase.save(newCredential);

    const newUser = this.userDataBase.create({
      name: createUserDto.name,
      lastName: createUserDto.lastname,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      address: createUserDto.address,
      birthDate: createUserDto.birthDate,
      credential_id: newCredential,
    });
    await this.userDataBase.save(newUser);
    console.log(
      `Se creo el nuevo usuario con username: ${newUser.credential_id.userName}`,
    );
    return 'Usuario creado en la base de datos';
  }

  // postCreateUserRepository(user: IUser) {
  //   return 'vamos a crear un usuario';
  // }

  getUserByIdTwoRepository(id: number) {
    return this.users.find((user) => user.id === id);
  }

  // getUpdateUserRepository(user: IUserUpdate) {
  //   const userExisting = this.users.find((user) => user.id === user.id);
  //   if (!userExisting) {
  //     throw new NotFoundException('Este Usuario no existe');
  //   }
  //   userExisting.email = user.email;
  //   userExisting.name = user.name;
  //   return this.users;
  // }
}
