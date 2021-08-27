import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ProductService } from '../product/product.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderProductRepository } from './entities/order-products.repository';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './entities/order.repository';
import { IReturnOrderData } from './etc/types';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderRepository)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(OrderProductRepository)
    private readonly orderProductRepository: OrderProductRepository,
    private readonly productService: ProductService,
  ) {}

  @Transactional()
  async create({ products }: CreateOrderDto): Promise<IReturnOrderData> {
    const order = await this.orderRepository.save({ total: 0 });

    let sumTotal = 0;
    await Promise.all(
      products.map(async ({ name, quantity }) => {
        const product =
          await this.productService.findOneByNameAndThereIsQuantity(
            name,
            quantity,
          );
        if (!product) {
          throw Error(`There is not sufficient product ${name} quantity`);
        }
        sumTotal = sumTotal + quantity * product.price;
        await this.productService.update(product.id, {
          quantity: product.quantity - quantity,
        });
        return this.orderProductRepository.save({ order, product, quantity });
      }),
    ).catch((err) => {
      throw new BadRequestException(err.message);
    });

    await this.orderRepository.save({
      ...order,
      total: sumTotal,
    });

    const newOrder = await this.orderRepository.findOrderById(order.id);

    return this.buildReturnedOrder(newOrder);
  }

  async findAll(): Promise<IReturnOrderData[]> {
    const orders = await this.orderRepository.findAll();
    return orders.map(
      (order) => this.buildReturnedOrder(order) as IReturnOrderData,
    );
  }

  async findOne(orderId: string): Promise<IReturnOrderData> {
    const order = await this.orderRepository.findOrderById(orderId);
    return this.buildReturnedOrder(order);
  }

  private buildReturnedOrder({
    id,
    orderProducts,
    total,
  }: OrderEntity): IReturnOrderData {
    return {
      id: id,
      products: orderProducts.map(({ quantity, product: { name, price } }) => ({
        name,
        quantity,
        price,
      })),
      total,
    };
  }
}
