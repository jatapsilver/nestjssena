import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  //ruta para obtener todos los productos
  @Get('getAllProducts')
  getAllProducts() {
    return this.productService.getAllProductsService();
  }

  @Delete('delete/:uuid')
  deleteProduct(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.productService.deleteProductsService(uuid);
  }
}
