import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddExhibitionBoothTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'exhibition_booths',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'exhibition_event_id', type: 'int' },
                { name: 'exhibition_hall_id', type: 'int' },
                { name: 'company_id', type: 'int', isNullable: true },
                { name: 'booth_number', type: 'varchar' },
                { name: 'booth_type', type: "enum", enum: ['standard', 'corner', 'island', 'ring'], default: `'standard'` },
                { name: 'price_irr', type: 'decimal', precision: 10, scale: 2, isNullable: true },
                { name: 'price_usd', type: 'decimal', precision: 10, scale: 2, isNullable: true },
                { name: 'prices_other', type: 'json', isNullable: true },
                { name: 'width', type: 'int' },
                { name: 'height', type: 'int' },
                { name: 'quality', type: "enum", enum: ['low', 'medium', 'high'], default: `'medium'` },
                { name: 'booth_layout', type: 'varchar' },
                { name: 'amenities', type: 'json', isNullable: true },
                { name: 'status', type: "enum", enum: ['pending', 'reserved', 'confirmed', 'paid', 'canceled'], default: `'pending'` },
                { name: 'reservation_date_temp', type: 'date', isNullable: true },
                { name: 'reservation_date', type: 'date', isNullable: true },
                { name: 'is_temp_reservation', type: 'boolean' },
                { name: 'expiration_date', type: 'date', isNullable: true },
                { name: 'barcode', type: 'varchar' },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                { name: 'deleted_at', type: 'timestamp', isNullable: true }
            ]
        }));

        await queryRunner.createForeignKeys('exhibition_booths', [
            new TableForeignKey({ columnNames: ['exhibition_event_id'], referencedColumnNames: ['id'], referencedTableName: 'exhibition_events', onDelete: 'CASCADE' }),
            new TableForeignKey({ columnNames: ['exhibition_hall_id'], referencedColumnNames: ['id'], referencedTableName: 'exhibition_halls', onDelete: 'CASCADE' }),
            new TableForeignKey({ columnNames: ['company_id'], referencedColumnNames: ['id'], referencedTableName: 'companies', onDelete: 'SET NULL' })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('exhibition_booths');
    }
}
