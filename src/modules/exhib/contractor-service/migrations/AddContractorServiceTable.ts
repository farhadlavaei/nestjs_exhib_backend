import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddContractorServiceTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'contractor_service',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'contractor_id', type: 'int' },
                    { name: 'exhibition_id', type: 'int' },
                    { name: 'service_id', type: 'int' },
                    { name: 'price', type: 'decimal', precision: 10, scale: 2 },
                    { name: 'active', type: 'boolean', default: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'deleted_at', type: 'timestamp', default: null },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('contractor_service');
    }
}
