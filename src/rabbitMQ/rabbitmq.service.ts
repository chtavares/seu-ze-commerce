import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ERabbitmqRouteKey } from './etc/types';

@Injectable()
export class RabbitMQService {
  @RabbitRPC({
    exchange: process.env.RABBITMQ_EXCHANGE,
    routingKey: ERabbitmqRouteKey.INCREMENTED,
  })
  async incrementedHandler(productName: string) {
    console.log('incremented:', productName);
  }

  @RabbitRPC({
    exchange: process.env.RABBITMQ_EXCHANGE,
    routingKey: ERabbitmqRouteKey.DECREMENTED,
  })
  async decrementedHandler(productName: string) {
    console.log('decremented:', productName);
  }
}
