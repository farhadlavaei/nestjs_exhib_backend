import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddExpertTable1707050000000 implements MigrationInterface {
    private tableName = 'exhibition_expert';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'exhibition_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
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
                        default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );

        // Adding Foreign Keys
        await queryRunner.createForeignKeys(this.tableName, [
            new TableForeignKey({
                columnNames: ['exhibition_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'exhibition_events',
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
