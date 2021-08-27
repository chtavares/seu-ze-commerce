import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ProductDto } from '../../product/dto/product.dto';

export class CreateOrderDto {
  @Type(() => ProductDto)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  products: ProductDto[];
}
