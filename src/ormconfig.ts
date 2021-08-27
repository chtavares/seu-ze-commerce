import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import './env-defaults';
import { OrderProductEntity } from './order/entities/order-products.entity';
import { OrderEntity } from './order/entities/order.entity';
import { ProductEntity } from './product/entities/product.entity';

const entities = [ProductEntity, OrderEntity, OrderProductEntity];

const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  keepConnectionAlive: true,
  migrations: [`src/migrations/*.ts`],
  migrationsTableName: 'migrations',
  logging: true,
  maxQueryExecutionTime: 60000,
  cli: {
    entitiesDir: `src`,
    migrationsDir: `src/migrations`,
  },
  synchronize: false,
  entities,
};

export = ormconfig;
