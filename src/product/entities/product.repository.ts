import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ProductEntity } from './product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends BaseRepository<ProductEntity> {}
