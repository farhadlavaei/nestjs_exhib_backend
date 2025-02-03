import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCompaniesTableXXXXXX implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'companies',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'user_id', type: 'int', isNullable: false },
                    { name: 'company_name', type: 'varchar', isNullable: false },
                    { name: 'company_name_en', type: 'varchar', isNullable: false },
                    { name: 'economic_code', type: 'varchar', isNullable: false },
                    { name: 'registration_number', type: 'varchar', isNullable: false },
                    { name: 'address', type: 'varchar', isNullable: false },
                    { name: 'address_en', type: 'varchar', isNullable: false },
                    { name: 'activity_type', type: 'varchar', isNullable: false },
                    { name: 'activity_description', type: 'text', isNullable: false },
                    { name: 'activity_description_en', type: 'text', isNullable: false },
                    { name: 'created_at', type: 'timestamp', default: 'now()' },
                    { name: 'updated_at', type: 'timestamp', default: 'now()' },
                    { name: 'deleted_at', type: 'timestamp', isNullable: true },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'companies',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('companies');
    }
}
