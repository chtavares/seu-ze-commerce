import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { OrderEntity } from './order.entity';

@EntityRepository(OrderEntity)
export class OrderRepository extends BaseRepository<OrderEntity> {
  async findOrderById(orderId: string): Promise<OrderEntity> {
    return this.createQueryBuilder('order')
      .innerJoinAndSelect('order.orderProducts', 'orderProducts')
      .innerJoinAndSelect('orderProducts.product', 'product')
      .where('order.id = :id', { id: orderId })
      .getOneOrFail();
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.createQueryBuilder('order')
      .innerJoinAndSelect('order.orderProducts', 'orderProducts')
      .innerJoinAndSelect('orderProducts.product', 'product')
      .getMany();
  }
}
