import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationOne1762357194230 implements MigrationInterface {
  name = 'MigrationOne1762357194230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isActive"`);
  }
}
