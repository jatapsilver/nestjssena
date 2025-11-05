import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env.development' });

const config: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  logging: false, // muestra por consola la interaccion con la base de datos
  synchronize: false, // sincroniza las entidades con la base de datos
  dropSchema: false, // limpia, borra y crea nuevamente todas las entidades
  migrationsTableName: 'migrations_history',
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
