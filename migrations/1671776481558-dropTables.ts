import { MigrationInterface, QueryRunner } from "typeorm"

export class dropTables1671776481558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`category_posts_post\``);
        await queryRunner.query(`DROP TABLE \`movie\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Irreversible operation
    }

}
