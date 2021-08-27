import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderAndProductTables1630067094862
  implements MigrationInterface
{
  name = 'CreateOrderAndProductTables1630067094862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`seuzecommerce\`.\`product\` (\`id\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`price\` float NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`seuzecommerce\`.\`order\` (\`id\` char(36) NOT NULL, \`total\` float NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`seuzecommerce\`.\`order_product\` (\`id\` char(36) NOT NULL, \`quantity\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productId\` char(36) NULL, \`orderId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`seuzecommerce\`.\`order_product\` ADD CONSTRAINT \`FK_073c85ed133e05241040bd70f02\` FOREIGN KEY (\`productId\`) REFERENCES \`seuzecommerce\`.\`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`seuzecommerce\`.\`order_product\` ADD CONSTRAINT \`FK_3fb066240db56c9558a91139431\` FOREIGN KEY (\`orderId\`) REFERENCES \`seuzecommerce\`.\`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`seuzecommerce\`.\`order_product\` DROP FOREIGN KEY \`FK_3fb066240db56c9558a91139431\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`seuzecommerce\`.\`order_product\` DROP FOREIGN KEY \`FK_073c85ed133e05241040bd70f02\``,
    );
    await queryRunner.query(`DROP TABLE \`seuzecommerce\`.\`order_product\``);
    await queryRunner.query(`DROP TABLE \`seuzecommerce\`.\`order\``);
    await queryRunner.query(`DROP TABLE \`seuzecommerce\`.\`product\``);
  }
}
