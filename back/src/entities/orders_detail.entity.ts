import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Products } from './product.entity';

@Entity({ name: 'orders_detail' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  cant: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subTotal: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  iva: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  shippingFees: number;

  @ManyToOne(() => Order, (order) => order.order_detail)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Products, (products) => products.order_detail)
  @JoinColumn({ name: 'product_id' })
  products: Products;
}
