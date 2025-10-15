import { Injectable } from '@nestjs/common';
import { SeedRepository } from './seed.repository';

@Injectable()
export class SeedService {
  constructor(private readonly seedRepository: SeedRepository) {}
  getSeedCategoryService() {
    return this.seedRepository.getSeedCategoryRepository();
  }
}
