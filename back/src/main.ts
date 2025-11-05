import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/loggerGlobal';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const options = new DocumentBuilder()
    .setTitle('E-commerce API - Javier Plata')
    .setDescription(
      'API REST para la gestión completa de un sistema de comercio electrónico. Incluye módulos de autenticación y autorización con JWT, gestión de usuarios y roles, catálogo de productos por categorías, procesamiento de órdenes de compra y sistema de archivos. Desarrollada con NestJS y TypeORM.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3002);
  console.log('Servidor corriendo en el puerto 3002');
}
bootstrap();
