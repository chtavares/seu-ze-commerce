import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ERabbitmqRouteKey } from './etc/types';

@Injectable()
export class RabbitMQService {
  constructor(private readonly productService: ProductService) {}

  @RabbitRPC({
    exchange: process.env.RABBITMQ_EXCHANGE,
    routingKey: ERabbitmqRouteKey.INCREMENTED,
  })
  async incrementedHandler(productName: string): Promise<boolean> {
    return this.productService.handleStockProduct(
      productName,
      ERabbitmqRouteKey.INCREMENTED,
    );
  }

  @RabbitRPC({
    exchange: process.env.RABBITMQ_EXCHANGE,
    routingKey: ERabbitmqRouteKey.DECREMENTED,
  })
  async decrementedHandler(productName: string): Promise<boolean> {
    return await this.productService.handleStockProduct(
      productName,
      ERabbitmqRouteKey.DECREMENTED,
    );
  }
}
