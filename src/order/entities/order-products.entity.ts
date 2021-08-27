import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_product', orderBy: { createdAt: 'DESC' } })
export class OrderProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne((type) => ProductEntity, (product) => product.orders)
  product: ProductEntity;

  @ManyToOne((type) => OrderEntity, (order) => order.products)
  order: OrderEntity;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
