import { MigrationInterface, QueryRunner } from "typeorm";

export class changePostBodyColumnType1672302609356 implements MigrationInterface {
    name = 'changePostBodyColumnType1672302609356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`body\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`body\``);
    }

}
