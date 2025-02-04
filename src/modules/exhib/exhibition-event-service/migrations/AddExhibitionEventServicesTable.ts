import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddExhibitionEventServicesTableXXXXXXX implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'exhibition_event_services',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'exhibition_event_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'exhibition_service_id',
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

        // Add foreign key constraints
        await queryRunner.createForeignKey(
            'exhibition_event_services',
            new TableForeignKey({
                columnNames: ['exhibition_event_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'exhibition_events',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'exhibition_event_services',
            new TableForeignKey({
                columnNames: ['exhibition_service_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'exhibition_service',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('exhibition_event_services');
    }
}
