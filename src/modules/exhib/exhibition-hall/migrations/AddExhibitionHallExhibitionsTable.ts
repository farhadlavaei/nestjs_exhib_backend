import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddExhibitionHallExhibitionsTable1700000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'exhibition_hall_exhibitions',
                columns: [
                    {
                        name: 'exhibition_event_id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'exhibition_hall_id',
                        type: 'int',
                        isPrimary: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['exhibition_event_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'exhibition_events',
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['exhibition_hall_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'exhibition_halls',
                        onDelete: 'CASCADE',
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('exhibition_hall_exhibitions');
    }
}
