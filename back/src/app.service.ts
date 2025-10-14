import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { Credential } from './entities/credential.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenidos a Sena mujeres digitales';
  }
}

@Injectable()
export class DataLoaderUsers implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userBD: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialBD: Repository<Credential>,
  ) {}

  async onModuleInit() {
    const usersCount = await this.userBD.count();

    if (usersCount === 0) {
      console.log('Cargando usuarios iniciales...');
      const queryRunner = this.userBD.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const filePath = path.resolve(__dirname, '..', 'utils', 'data.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const users = JSON.parse(rawData) as Array<{
          username: string;
          password: string;
          name: string;
          lastName: string;
          address: string;
          email: string;
          phoneNumber: string;
          birthDate: string;
        }>;

        await Promise.all(
          users.map(async (user) => {
            const newCredential = this.credentialBD.create({
              userName: user.username,
              password: user.password,
            });
            await queryRunner.manager.save(newCredential);

            const newUser = this.userBD.create({
              name: user.name,
              lastName: user.lastName,
              address: user.address,
              email: user.email,
              phoneNumber: Number(user.phoneNumber),
              birthDate: new Date(user.birthDate),
              credential_id: newCredential,
            });
            await queryRunner.manager.save(newUser);
          }),
        );
        await queryRunner.commitTransaction();
        console.log('Usuarios Precargados correctamente');
      } catch (error) {
        console.error('Error al precargar usuario:', error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } else {
      console.log('Los usuarios ya existen en laa base de datos');
    }
  }
}
