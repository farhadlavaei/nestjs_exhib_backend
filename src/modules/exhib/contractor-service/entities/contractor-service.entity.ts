import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import {ExhibitionContractor} from "../../exhibition_contractor/entities/exhibition-contractor.entity";

@Entity('contractor_service')
export class ContractorService {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExhibitionContractor, (contractor) => contractor.contractorServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contractor_id' })
    contractor: ExhibitionContractor;

    @ManyToOne(() => ExhibitionEvent, (event) => event.contractorServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exhibition_id' })
    exhibition: ExhibitionEvent;

   /* @ManyToOne(() => ExhibitionService, (service) => service.contractorServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: ExhibitionService;*/

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
