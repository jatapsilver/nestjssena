import { StatusOrder } from 'src/enum/statusOrder.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { OrderDetail } from './orders_detail.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  addressDelivery: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deliveryDate: Date;

  @Column({
    type: 'enum',
    enum: StatusOrder,
    default: StatusOrder.CREATED,
  })
  statusOrder: StatusOrder;

  @ManyToOne(() => User, (users) => users.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderDetail, (order_detail) => order_detail.order)
  order_detail: OrderDetail[];
}
