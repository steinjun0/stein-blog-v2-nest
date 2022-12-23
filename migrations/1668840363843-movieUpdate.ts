import { MigrationInterface, QueryRunner } from "typeorm";

export class movieUpdate1668840363843 implements MigrationInterface {
    name = 'movieUpdate1668840363843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`movie\` DROP COLUMN \`genre\``);
        await queryRunner.query(`ALTER TABLE \`movie\` ADD \`genre\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`movie\` DROP COLUMN \`genre\``);
        await queryRunner.query(`ALTER TABLE \`movie\` ADD \`genre\` varchar(255) NOT NULL`);
    }

}
