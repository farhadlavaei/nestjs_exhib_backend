import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import { ExhibitionHall } from '../../exhibition-hall/entities/exhibition-hall.entity';
import { Company } from '../../company/entities/company.entity';

@Entity('exhibition_booths')
export class ExhibitionBooth {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExhibitionEvent, event => event.booths, { onDelete: 'CASCADE' })
    exhibition_event: ExhibitionEvent;

    @ManyToOne(() => ExhibitionHall, hall => hall.booths, { onDelete: 'CASCADE' })
    exhibition_hall: ExhibitionHall;

    @ManyToOne(() => Company, company => company.booths, { nullable: true, onDelete: 'SET NULL' })
    company: Company;

    @Column()
    booth_number: string;

    @Column({ type: 'enum', enum: ['standard', 'corner', 'island', 'ring'], default: 'standard' })
    booth_type: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price_irr?: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price_usd?: number;

    @Column({ type: 'json', nullable: true })
    prices_other?: string;

    @Column()
    width: number;

    @Column()
    height: number;

    @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
    quality: string;

    @Column()
    booth_layout: string;

    @Column({ type: 'json', nullable: true })
    amenities?: string;

    @Column({ type: 'enum', enum: ['pending', 'reserved', 'confirmed', 'paid', 'canceled'], default: 'pending' })
    status: string;

    @Column({ nullable: true })
    reservation_date_temp?: string;

    @Column({ nullable: true })
    reservation_date?: string;

    @Column()
    is_temp_reservation: boolean;

    @Column({ nullable: true })
    expiration_date?: string;

    @Column()
    barcode: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}
