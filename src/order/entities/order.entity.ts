import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProductEntity } from './order-products.entity';

@Entity({ name: 'order', orderBy: { createdAt: 'DESC' } })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  total: number;

  @OneToMany(
    (type) => OrderProductEntity,
    (orderProduct) => orderProduct.product,
  )
  @JoinColumn()
  products: OrderProductEntity[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
