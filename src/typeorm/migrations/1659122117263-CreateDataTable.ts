import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDataTable1659122117263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'statistic_data',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'system_uptime',
            type: 'timestamp',
          },
          {
            name: 'total_RAM',
            type: 'bigint',
          },
          {
            name: 'allocated_RAM',
            type: 'bigint',
          },
          {
            name: 'total_disk',
            type: 'bigint',
          },
          {
            name: 'allocated_disk',
            type: 'bigint',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('statistic_data');
  }
}
