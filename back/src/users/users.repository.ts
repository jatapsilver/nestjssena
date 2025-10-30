import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreatedUserDto } from './Dtos/createUser.dto';
import { Credential } from 'src/entities/credential.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}
  //metodo para obtener todos los usuarios
  async getAllUserRepository() {
    const users = await this.userDataBase.find({
      relations: ['credential_id'],
    });
    return users;
  }

  //metodo para obtener un usuario por su id
  async getUserByIdRepository(uuid: string) {
    return await this.userDataBase.findOne({
      where: { uuid: uuid },
      relations: ['credential_id', 'orders'],
    });
  }

  //metodo para obtener el perfil de un usuario
  getUserProfileRepository(userExisting: User) {
    const { credential_id, orders, ...userProfile } = userExisting;
    return {
      ...userProfile,
      username: credential_id.userName,
      rol: credential_id.roles,
      orders: orders,
    };
  }

  //metodo para buscar usuario por nombre
  async getUserByNameRepository(name: string) {
    return await this.userDataBase.find({
      where: { name: name },
      relations: ['credential_id'],
    });
  }

  //metodo para obtener un usuario por su correo
  async getUserByEmail(email: string) {
    return await this.userDataBase.findOne({ where: { email: email } });
  }

  //metodo para obtener un usuario por su numero telefonico
  async getByUserPhoneNumber(phoneNumber: number) {
    return await this.userDataBase.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  //metodo para crear un usuario
  async createUserRepository(createUserDto: CreatedUserDto) {
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
    return {
      message: `Usuario creado con nombre ${newUser.name} en la base de datos`,
    };
  }

  //metodo para actualizar un usuario
  async putUpdateUserRepository(
    userExisting: User,
    updateUserDto: UpdateUserDto,
  ) {
    if (updateUserDto.name) {
      userExisting.name = updateUserDto.name;
    }

    if (updateUserDto.lastname) {
      userExisting.lastName = updateUserDto.lastname;
    }

    await this.userDataBase.save(userExisting);
    return { message: 'Usuario actualizado' };
  }

  //metodo para hacer un softDelete del usuario

  async deleteUserRepository(userExisting: User) {
    userExisting.isActive = false;
    await this.userDataBase.save(userExisting);
    return { message: `El usuario ${userExisting.name} se desactivo` };
  }
}
