import { Controller, Get, Param } from '@nestjs/common';
import { IFindProductByName } from './etc/types';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':name')
  findOneByName(@Param('name') name: string): Promise<IFindProductByName> {
    return this.productService.findOneByName(name);
  }
}
