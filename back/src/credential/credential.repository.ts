import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from 'src/entities/credential.entity';
import { Repository } from 'typeorm';

export class CredentialRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}
  //metodo para obtener un usuario por su username
  async getCredentialByUsername(userName: string) {
    return await this.credentialDataBase.findOne({
      where: { userName: userName },
      relations: ['user_id'],
    });
  }
}
