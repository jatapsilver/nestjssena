import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, DataLoaderUsers } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialModule } from './credential/credential.module';
import { User } from './entities/users.entity';
import { Credential } from './entities/credential.entity';
import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { OrderDetailModule } from './order_detail/order_detail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm') ?? {},
    }),
    TypeOrmModule.forFeature([User, Credential]),
    UsersModule,
    AuthModule,
    ProductsModule,
    CredentialModule,
    OrdersModule,
    SeedModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    CategoryModule,
    OrderDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataLoaderUsers],
})
export class AppModule {}
