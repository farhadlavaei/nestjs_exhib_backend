import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddExhibitionHallTable1700000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'exhibition_halls',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'length',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'width',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'height',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'capacity',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'floor_type',
                        type: 'enum',
                        enum: ['carpet', 'tile', 'wood', 'other'],
                        isNullable: false,
                    },
                    {
                        name: 'load_capacity',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'has_air_conditioning',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_heating',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_water_supply',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_electricity',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_internet',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_security_system',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_audio_visual_system',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_storage_space',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'has_parking',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'parking_capacity',
                        type: 'int',
                        isNullable: true,
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
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('exhibition_halls');
    }
}
