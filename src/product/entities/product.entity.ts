import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProductEntity } from '../../order/entities/order-products.entity';

@Entity({ name: 'product', orderBy: { createdAt: 'DESC' } })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  price: number;

  @OneToMany((type) => OrderProductEntity, (orderProduct) => orderProduct.order)
  @JoinColumn()
  orders: OrderProductEntity[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
