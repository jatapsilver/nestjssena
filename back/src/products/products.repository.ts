import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Products)
    private readonly productsDataBase: Repository<Products>,
  ) {}
  //metodo para obtener todos los productos
  async getAllProductsRepository() {
    return await this.productsDataBase.find();
  }

  //metodo para obtener el producto por su id
  async getProductById(uuid: string) {
    return await this.productsDataBase.findOne({ where: { uuid: uuid } });
  }

  //metodo para hacer un softDelete de un producto
  async deleteProductsRepository(productExisting: Products) {
    productExisting.isActive = false;
    await this.productsDataBase.save(productExisting);
    return {
      message: `Este Producto ${productExisting.name} ha sido eliminado`,
    };
  }
}
