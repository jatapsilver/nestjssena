import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1762355939129 implements MigrationInterface {
  name = 'InitialMigration1762355939129';

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
