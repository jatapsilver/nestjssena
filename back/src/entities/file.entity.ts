import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class File {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column({ type: 'bytea' })
  data: Buffer;
}
