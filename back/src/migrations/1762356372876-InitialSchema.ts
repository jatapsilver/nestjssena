import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762356372876 implements MigrationInterface {
    name = 'InitialSchema1762356372876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric`);
    }

}
