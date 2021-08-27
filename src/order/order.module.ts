import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/order-products.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './entities/order.repository';
import { OrderProductRepository } from './entities/order-products.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderProductEntity,
      OrderEntity,
      OrderRepository,
      OrderProductRepository,
    ]),
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
