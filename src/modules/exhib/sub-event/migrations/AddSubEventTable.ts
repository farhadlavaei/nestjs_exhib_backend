// npm run typeorm migration:run -- -t AddSubEventTable1707059200000
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddSubEventTable1707059200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'sub_events',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'parent_event_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'sub_event_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
        );

        // Adding foreign key for parent_event_id
        await queryRunner.createForeignKey(
            'sub_events',
            new TableForeignKey({
                columnNames: ['parent_event_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'exhibition_events',
                onDelete: 'CASCADE',
            }),
        );

        // Adding foreign key for sub_event_id
        await queryRunner.createForeignKey(
            'sub_events',
            new TableForeignKey({
                columnNames: ['sub_event_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'exhibition_events',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('sub_events');
    }
}
