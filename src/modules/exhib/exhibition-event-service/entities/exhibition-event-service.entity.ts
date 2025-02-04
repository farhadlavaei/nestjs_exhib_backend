import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ExhibitionEvent } from '../../exhibition-event/entities/exhibition-event.entity';
import { ExhibitionService } from '../../exhibition-service/entities/exhibition-service.entity';

@Entity('exhibition_event_services')
export class ExhibitionEventService {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExhibitionEvent, (event) => event.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exhibition_event_id' })
    event: ExhibitionEvent;

    @ManyToOne(() => ExhibitionService, (service) => service.events, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exhibition_service_id' })
    service: ExhibitionService;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
