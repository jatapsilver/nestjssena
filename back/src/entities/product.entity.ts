import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './cateogires.entity';

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

  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];
}
