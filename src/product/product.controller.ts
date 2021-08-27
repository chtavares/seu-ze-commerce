import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.productService.findOne(name);
  }
}
