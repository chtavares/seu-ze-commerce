import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  findOne(name: string) {
    return `This action returns a #${name} product`;
  }
}
