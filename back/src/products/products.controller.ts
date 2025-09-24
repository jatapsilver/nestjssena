import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get('getAllProducts')
  getAllProducts() {
    return 'Ruta de todos los productos';
  }
}
