import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateToCategory1762321207282 implements MigrationInterface {
  name = 'AddDateToCategory1762321207282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createAt"`);
  }
}
