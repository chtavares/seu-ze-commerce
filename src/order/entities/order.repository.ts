import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { OrderEntity } from './order.entity';

@EntityRepository(OrderEntity)
export class OrderRepository extends BaseRepository<OrderEntity> {}
