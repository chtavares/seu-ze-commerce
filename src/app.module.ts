import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENVIRONMENT } from './env-defaults';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import './env-defaults';
import { RabbitModule } from './rabbitMQ/rabbitmq.module';

const imports = [ProductModule, OrderModule, RabbitModule];
const entities = [];

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
      entities,
      synchronize: false,
    }),
    ConfigModule.forRoot({
      envFilePath: `.${ENVIRONMENT}.env`,
      isGlobal: true,
    }),
    ...imports,
  ],
})
export class AppModule {}
