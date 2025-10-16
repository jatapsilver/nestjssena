import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/cateogires.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryDataBase: Repository<Category>,
  ) {}
  async getSeedCategoryRepository() {
    const count = await this.categoryDataBase.count();
    if (count !== 0) {
      throw new ConflictException('Ya existen las categorias');
    }

    const categories = [
      { name: 'Tecnologia' },
      { name: 'Casa' },
      { name: 'Videojuegos' },
    ];

    await this.categoryDataBase.save(categories);
    return { message: 'Categorias cargadas correctamente' };
  }
}
