import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1762320486158 implements MigrationInterface {
  name = 'InitialSchema1762320486158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
  }
}
