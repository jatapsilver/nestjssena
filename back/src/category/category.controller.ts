import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { CreateCategoryDto } from './Dtos/createCategory.dto';
import { UpdateCategoryDto } from './Dtos/updateCategory.dto';

@ApiTags('Categorias')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Endpoint para obtener todas las categorias
  @ApiOperation({ summary: 'Obtener todas las categorias' })
  @ApiResponse({
    status: 200,
    description: 'Categorias obtenidas exitosamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('allCategories')
  findAll() {
    return this.categoryService.findAllServices();
  }

  //Endpoint para obtener una categoria por su id
  @ApiOperation({ summary: 'Obtener una categoria por su id' })
  @ApiResponse({
    status: 200,
    description: 'Categorias obtenidas por id.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('getCategory')
  getCategory() {
    return 'Devuelve su categoria por id';
  }

  //Endpoint para crear una categoria
  @ApiOperation({ summary: 'Crear una categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria creada exitosamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Post('createCategory')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  //Endpoint para actualizar una categoria
  @ApiOperation({ summary: 'Actualizar una categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria actualizada exitosamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @Put('updateCategory')
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto);
  }
}
