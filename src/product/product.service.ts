import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERabbitmqRouteKey } from '../rabbitMQ/etc/types';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './entities/product.repository';
import { IFindProductByName } from './etc/types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async findOneByName(productName: string): Promise<IFindProductByName> {
    const { name, price, quantity } = await this.productRepository
      .findOneOrFail({ name: productName })
      .catch(() => {
        throw new NotFoundException(`Product ${productName} not found!`);
      });

    return { name, price, quantity };
  }

  async findOneByNameAndThereIsQuantity(
    name: string,
    quantity: number,
  ): Promise<ProductEntity> {
    return this.productRepository.findOneByNameAndThereIsQuantity(
      name,
      quantity,
    );
  }

  @Transactional()
  async update(
    id: string,
    data: Partial<ProductEntity>,
  ): Promise<UpdateResult> {
    return this.productRepository.update(id, data);
  }

  @Transactional()
  async handleStockProduct(
    productName: string,
    type: ERabbitmqRouteKey,
  ): Promise<boolean> {
    switch (type) {
      case ERabbitmqRouteKey.INCREMENTED:
        return this.incrementProductStock(productName);
      case ERabbitmqRouteKey.DECREMENTED:
        return this.decrementProductStock(productName);
      default:
        throw new BadRequestException(`This type ${type} not exist`);
    }
  }

  @Transactional()
  private async incrementProductStock(name: string): Promise<boolean> {
    const product =
      await this.productRepository.findOneByNameAndThereIsQuantity(name, 0);
    if (!product) {
      return false;
    }

    await this.update(product.id, {
      quantity: product.quantity + 1,
    });

    return true;
  }

  @Transactional()
  private async decrementProductStock(name: string): Promise<boolean> {
    const product =
      await this.productRepository.findOneByNameAndThereIsQuantity(name, 1);
    if (!product) {
      return false;
    }

    await this.update(product.id, {
      quantity: product.quantity - 1,
    });

    return true;
  }
}
