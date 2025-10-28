import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}
  getAllProductsService() {
    return this.productRepository.getAllProductsRepository();
  }

  async deleteProductsService(uuid: string) {
    const productExisting = await this.productRepository.getProductById(uuid);
    if (!productExisting) {
      throw new NotFoundException('Este producto no existe');
    }

    if (productExisting.isActive === false) {
      throw new BadRequestException('Este producto esta inactivo');
    }

    return this.productRepository.deleteProductsRepository(productExisting);
  }
}
