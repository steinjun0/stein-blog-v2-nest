import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePostAndCategory1671775314730 implements MigrationInterface {
    name = 'updatePostAndCategory1671775314730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_categories_category\` DROP FOREIGN KEY \`FK_a5e63f80ca58e7296d5864bd2d3\``);
        await queryRunner.query(`ALTER TABLE \`post_categories_category\` ADD CONSTRAINT \`FK_a5e63f80ca58e7296d5864bd2d3\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_categories_category\` DROP FOREIGN KEY \`FK_a5e63f80ca58e7296d5864bd2d3\``);
        await queryRunner.query(`ALTER TABLE \`post_categories_category\` ADD CONSTRAINT \`FK_a5e63f80ca58e7296d5864bd2d3\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
