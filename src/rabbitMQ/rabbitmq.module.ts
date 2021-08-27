import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
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
  ],
  providers: [RabbitMQService],
})
export class RabbitModule {}
