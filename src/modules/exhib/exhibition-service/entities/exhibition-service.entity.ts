import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import {ExhibitionContractor} from "../../exhibition_contractor/entities/exhibition-contractor.entity";

@Entity('exhibition_service')
export class ExhibitionService {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'integer', nullable: true })
    price: number;


    @ManyToOne(() => ExhibitionContractor, (contractor) => contractor.contractorServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contractor_id' })
    contractor: ExhibitionContractor;

    @ManyToMany(() => ExhibitionEvent, (event) => event.contractorServices)
    @JoinTable({
        name: 'exhibition_event_services',
        joinColumn: { name: 'exhibition_service_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'exhibition_event_id', referencedColumnName: 'id' },
    })
    events: ExhibitionEvent[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
