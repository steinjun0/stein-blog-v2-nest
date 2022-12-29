import { MigrationInterface, QueryRunner } from "typeorm";

export class createFileUpdatePost1672286696785 implements MigrationInterface {
    name = 'createFileUpdatePost1672286696785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`postId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`body\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`body\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD CONSTRAINT \`FK_f0f2188b3e254ad31ba2b95ec4b\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_f0f2188b3e254ad31ba2b95ec4b\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`body\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`body\` text NOT NULL`);
        await queryRunner.query(`DROP TABLE \`file\``);
    }

}
