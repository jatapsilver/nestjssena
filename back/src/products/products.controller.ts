import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get('getAllProducts')
  getAllProducts() {
    return 'Ruta de todos los productos';
  }
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: MulterFile) {
  //   // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   // }
  //   return file;
  // }
}
