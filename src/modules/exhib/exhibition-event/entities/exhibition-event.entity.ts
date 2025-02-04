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
import {Location} from '../../location/entities/location.entity';
import {Speaker} from '../../speaker/entities/speaker.entity';
import {SubEvent} from "../../sub-event/entities/sub-event.entity";
import {Expert} from "../../exhibition_expert/entities/expert.entity";

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

    @ManyToOne(() => Company, (company) => company.events, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'company_id'})
    company: Company;

    @ManyToOne(() => ExhibitionEvent, (event) => event.childEvents, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'parent_event_id'})
    parentEvent: ExhibitionEvent;

    @OneToMany(() => ExhibitionEvent, (event) => event.parentEvent)
    childEvents: ExhibitionEvent[];

    @ManyToOne(() => Location, (location) => location.events, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'location_id'})
    location: Location;

    @OneToMany(() => SubEvent, (subEvent) => subEvent.parentEvent)
    parentSubEvents: SubEvent[];

    @OneToMany(() => SubEvent, (subEvent) => subEvent.childEvent)
    childSubEvents: SubEvent[];

    @OneToMany(() => Speaker, (speaker) => speaker.event, {cascade: true})
    speakers: Speaker[];

    @OneToMany(() => Expert, (expert) => expert.event, { cascade: true })
    experts: Expert[];

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;
}
