import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENVIRONMENT } from './env-defaults';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { RabbitModule } from './rabbitMQ/rabbitmq.module';
import ormconfig from './ormconfig';
import './env-defaults';
import { ProductEntity } from './product/entities/product.entity';
import { OrderEntity } from './order/entities/order.entity';
import { OrderProductEntity } from './order/entities/order-products.entity';

const imports = [ProductModule, OrderModule, RabbitModule];
const entities = [ProductEntity, OrderEntity, OrderProductEntity];

console.log({ ...ormconfig });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      keepConnectionAlive: true,
      logging: true,
      maxQueryExecutionTime: 60000,
      synchronize: false,
      entities,
    }),
    ConfigModule.forRoot({
      envFilePath: `.${ENVIRONMENT}.env`,
      isGlobal: true,
    }),
    ...imports,
  ],
})
export class AppModule {}
