import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn, OneToMany
} from 'typeorm';
import {Company} from '../../company/entities/company.entity';

@Entity('exhibition_events')
export class ExhibitionEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_name: string;

    @Column()
    event_name_en: string;

    @Column({
        type: 'enum',
        enum: ['exhibition', 'opening_ceremony', 'conference', 'seminar', 'other'],
    })
    event_type: string;

    @Column({type: 'date'})
    start_date: string;

    @Column({type: 'time'})
    start_time: string;

    @Column({type: 'date'})
    end_date: string;

    @Column({type: 'time'})
    end_time: string;

    @Column({type: 'date'})
    registration_start_date: string;

    @Column({type: 'date'})
    registration_end_date: string;

    @Column({type: 'longtext'})
    description: string;

    @Column({type: 'longtext'})
    description_en: string;

    @Column({default: 0})
    visitor_count: number;

    @Column({default: 0})
    participant_count: number;

    @Column({default: false})
    is_recurring: boolean;

    @Column({nullable: true})
    recurrence_rule: string;

    @Column({nullable: true})
    contact_email: string;

    @Column({nullable: true})
    contact_phone: string;

    @Column({nullable: true})
    website: string;

    @ManyToOne(() => Company, (company) => company.organizedEvents, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'organizer_id'})
    organizer: Company;

    @ManyToOne(() => Company, (company) => company.events, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })  
    company: Company;

    @ManyToOne(() => ExhibitionEvent, (event) => event.childEvents, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'parent_event_id'})
    parentEvent: ExhibitionEvent;

    @OneToMany(() => ExhibitionEvent, (event) => event.parentEvent)
    childEvents: ExhibitionEvent[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
