import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './cateogires.entity';
import { OrderDetail } from './orders_detail.entity';

@Entity({ name: 'products' })
export class Products {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'text',
    default: 'https://cdn-icons-png.flaticon.com/512/74/74472.png',
  })
  imgUrl: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @Column({
    type: 'timestamp',
  })
  createAt: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  @OneToMany(() => OrderDetail, (order_detail) => order_detail.products)
  order_detail: OrderDetail[];
}
