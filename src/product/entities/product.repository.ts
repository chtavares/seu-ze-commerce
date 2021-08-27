import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ProductEntity } from './product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends BaseRepository<ProductEntity> {
  async findOneByNameAndThereIsQuantity(
    name: string,
    quantity = 0,
  ): Promise<ProductEntity> {
    return this.createQueryBuilder('product')
      .where('name = :name', { name })
      .andWhere('quantity >= :quantity', { quantity })
      .getOne();
  }
}
