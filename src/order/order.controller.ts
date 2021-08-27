import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { IReturnOrderData } from './etc/types';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: CreateOrderDto): Promise<IReturnOrderData> {
    return this.orderService.create(body);
  }

  @Get()
  findAll(): Promise<IReturnOrderData[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IReturnOrderData> {
    return this.orderService.findOne(id);
  }
}
