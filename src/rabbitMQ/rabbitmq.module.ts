import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: process.env.RABBITMQ_EXCHANGE,
          type: process.env.RABBITMQ_EXCHANGE_TYPE,
        },
      ],
      uri: process.env.RABBITMQ_HOST,
    }),
    RabbitModule,
    ProductModule,
  ],
  providers: [RabbitMQService],
})
export class RabbitModule {}
