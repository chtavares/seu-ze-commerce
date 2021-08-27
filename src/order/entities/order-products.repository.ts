import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { OrderProductEntity } from './order-products.entity';

@EntityRepository(OrderProductEntity)
export class OrderProductRepository extends BaseRepository<OrderProductEntity> {}
